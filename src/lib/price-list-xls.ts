import { PRODUCTS, currentListPeriod, type Product } from "@/lib/catalog";

function escapeXml(value: string): string {
  return value.replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "\x26amp;";
    if (ch === "<") return "\x26lt;";
    if (ch === ">") return "\x26gt;";
    return "\x26quot;";
  });
}

function compoundName(product: Product): string {
  return [product.name, product.pack, product.unitNote].filter(Boolean).join(" ");
}

function stringCell(value: string, style = "text"): string {
  return `<Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function numberCell(value: number): string {
  return `<Cell ss:StyleID="money"><Data ss:Type="Number">${value}</Data></Cell>`;
}

/** Live catalog snapshot: every priced SKU, current 1–9 kit USD. No static workbook. */
function productRows(): string {
  return PRODUCTS.filter((product) => product.prices)
    .map((product) => `<Row>${stringCell(compoundName(product))}${numberCell(product.prices![0])}</Row>`)
    .join("");
}

export function buildPriceListWorkbook(): { filename: string; xml: string } {
  const period = currentListPeriod();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1" ss:Size="10"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="text">
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="money">
      <NumberFormat ss:Format="\x26quot;$\x26quot;#,##0"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Price list">
    <Table ss:DefaultRowHeight="18">
      <Column ss:Width="240"/>
      <Column ss:Width="96"/>
      <Row ss:Height="22">${stringCell("Compound Name", "header")}${stringCell("Price (USD)", "header")}</Row>
      ${productRows()}
    </Table>
  </Worksheet>
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
