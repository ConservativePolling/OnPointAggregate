import type { ExecutiveOrder, ExecutiveActionType } from "@/lib/types";

const FEDERAL_REGISTER_API = "https://www.federalregister.gov/api/v1";

interface FederalRegisterDocument {
  document_number: string;
  executive_order_number?: number;
  title: string;
  type: string;
  subtype?: string;
  signing_date?: string;
  publication_date: string;
  abstract?: string;
  topics?: string[];
  pdf_url?: string;
  html_url?: string;
  full_text_xml_url?: string;
}

interface FederalRegisterResponse {
  count: number;
  results: FederalRegisterDocument[];
  next_page_url?: string;
}

function mapDocumentType(type: string, subtype?: string): ExecutiveActionType {
  if (type === "Presidential Document") {
    if (subtype === "Executive Order") return "Executive Order";
    if (subtype === "Memorandum") return "Presidential Memorandum";
    if (subtype === "Proclamation") return "Proclamation";
    if (subtype === "Notice") return "Presidential Notice";
  }
  return "Executive Order";
}

function parseDocument(doc: FederalRegisterDocument): ExecutiveOrder {
  const actionType = mapDocumentType(doc.type, doc.subtype);
  const number = doc.executive_order_number
    ? String(doc.executive_order_number)
    : undefined;

  return {
    id: doc.document_number,
    number,
    title: doc.title,
    type: actionType,
    signedDate: doc.signing_date ?? doc.publication_date,
    publishedDate: doc.publication_date,
    summary: doc.abstract,
    topics: doc.topics ?? [],
    pdfUrl: doc.pdf_url,
    htmlUrl: doc.html_url,
    federalRegisterUrl: doc.html_url,
  };
}

export async function fetchRecentExecutiveOrders(
  fetchOptions?: RequestInit
): Promise<ExecutiveOrder[]> {
  const results: ExecutiveOrder[] = [];

  // Federal Register API uses bracket notation for conditions
  const baseParams = new URLSearchParams();
  baseParams.set("conditions[type][]", "PRESDOCU");
  baseParams.set("conditions[publication_date][gte]", "2025-01-20");
  baseParams.set("per_page", "100");
  baseParams.set("order", "newest");
  // Request specific fields
  const fields = [
    "document_number",
    "executive_order_number",
    "title",
    "type",
    "subtype",
    "signing_date",
    "publication_date",
    "abstract",
    "topics",
    "pdf_url",
    "html_url",
  ];
  fields.forEach((f) => baseParams.append("fields[]", f));

  let nextUrl: string | null = `${FEDERAL_REGISTER_API}/documents.json?${baseParams.toString()}`;

  // Paginate through all results
  while (nextUrl) {
    const response = await fetch(nextUrl, fetchOptions);
    if (!response.ok) {
      throw new Error(`Federal Register error: ${response.status}`);
    }
    const data = (await response.json()) as FederalRegisterResponse;
    results.push(...data.results.map(parseDocument));
    nextUrl = data.next_page_url ?? null;
  }

  return results;
}
