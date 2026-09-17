import {
  CATEGORIES,
  SPECIAL_ORDER_PRODUCTS,
  currentListPeriod,
  groupByName,
  productsInCategory,
  type Product,
} from "@/lib/catalog";
import { VOLUME_TIERS } from "@/lib/pricing";

function escapeXml(value: string): string {
  return value.replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "\x26amp;";
    if (ch === "<") return "\x26lt;";
    if (ch === ">") return "\x26gt;";
    return "\x26quot;";
  });
}

function sheetName(label: string): string {
  return label.replace(/[:\\/?*[\]]/g, " ").slice(0, 31);
}

function styleIdFor(name: string): string {
  const compact = name.replace(/[^a-z0-9]/gi, "").slice(0, 16);
  return `cat${compact || "x"}`;
}

function stringCell(value: string, style = "text"): string {
  return `<Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function numberCell(value: number): string {
  return `<Cell ss:StyleID="money"><Data ss:Type="Number">${value}</Data></Cell>`;
}

function quoteCells(): string {
  return Array.from({ length: VOLUME_TIERS.length }, () => stringCell("Quote", "muted")).join("");
}

function headerRow(): string {
  const heads = ["Compound", "Strength", ...VOLUME_TIERS.map((tier) => `${tier.fullLabel} (USD)`)];
  return `<Row ss:Height="22">${heads.map((head) => stringCell(head, "header")).join("")}</Row>`;
}

function productRows(products: Product[]): string {
  return groupByName(products)
    .flatMap((group) =>
      group.items.map((product, index) => {
        const strength = [product.pack, product.unitNote].filter(Boolean).join(" ");
        const prices = product.prices
          ? product.prices.map((price) => numberCell(price)).join("")
          : quoteCells();
        return `<Row>${stringCell(index === 0 ? group.name : "")}${stringCell(strength)}${prices}</Row>`;
      }),
    )
    .join("");
}

function sheetParts(
  tab: string,
  title: string,
  accent: string,
  products: Product[],
): { style: string; sheet: string } | null {
  if (!products.length) return null;
  const id = styleIdFor(tab);
  return {
    style: `<Style ss:ID="${id}">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="13"/>
      <Interior ss:Color="${accent}" ss:Pattern="Solid"/>
      <Alignment ss:Vertical="Center" ss:Horizontal="Left"/>
    </Style>`,
    sheet: `<Worksheet ss:Name="${escapeXml(sheetName(tab))}">
      <Table ss:DefaultRowHeight="18">
        <Column ss:Width="180"/>
        <Column ss:Width="88"/>
        ${VOLUME_TIERS.map(() => `<Column ss:Width="96"/>`).join("")}
        <Row ss:Height="28"><Cell ss:StyleID="${id}" ss:MergeAcross="6"><Data ss:Type="String">${escapeXml(title)}</Data></Cell></Row>
        ${headerRow()}
        ${productRows(products)}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>2</SplitHorizontal>
        <TopRowBottomPane>2</TopRowBottomPane>
      </WorksheetOptions>
    </Worksheet>`,
  };
}

export function buildPriceListWorkbook(): { filename: string; xml: string } {
  const period = currentListPeriod();
  const parts = [
    ...CATEGORIES.map((cat) =>
      sheetParts(
        cat.short,
        cat.label,
        cat.accent,
        productsInCategory(cat.id).filter((product) => !product.specialOrder),
      ),
    ),
    sheetParts("Special order", "Available via special order only", "#1B4F8A", SPECIAL_ORDER_PRODUCTS),
  ].filter((part): part is NonNullable<typeof part> => Boolean(part));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="10"/>
      <Interior ss:Color="#1B4F8A" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
    </Style>
    <Style ss:ID="text">
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="muted">
      <Font ss:Color="#5A6778" ss:Italic="1"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="money">
      <NumberFormat ss:Format="\x26quot;$\x26quot;#,##0"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    </Style>
    ${parts.map((part) => part.style).join("\n")}
  </Styles>
  ${parts.map((part) => part.sheet).join("\n")}
</Workbook>`;

  return {
    filename: `CBG-Peptide-Price-List-${period.month}-${period.year}.xls`,
    xml,
  };
}

export function downloadPriceListXls(): void {
  const { filename, xml } = buildPriceListWorkbook();
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
