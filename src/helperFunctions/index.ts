/**
 * Convert HTML to a readable string
 * @param html 
 */
export function stripHtml(html: string): string {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}