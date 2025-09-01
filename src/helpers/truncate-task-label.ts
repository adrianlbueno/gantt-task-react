export const truncateText = (text: string, maxWidth: number, textElement: SVGTextElement | null): string => {
    if (!textElement) return text;

    textElement.textContent = text;
    const fullWidth = textElement.getBBox().width;

    if (fullWidth <= maxWidth) {
        return text;
    }

    let start = 0;
    let end = text.length;
    let result = text;

    while (start <= end) {
        const mid = Math.floor((start + end) / 2);
        const truncated = text.substring(0, mid);
        textElement.textContent = truncated;
        const truncatedWidth = textElement.getBBox().width;

        if (truncatedWidth <= maxWidth) {
            result = truncated;
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return result;
};
