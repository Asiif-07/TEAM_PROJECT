export const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    // Count words of visible text, not HTML markup
    const text = (content || "").replace(/<[^>]*>/g, " ").trim();
    const noOfWords = text ? text.split(/\s+/g).length : 0;
    const minutes = noOfWords / wordsPerMinute;
    const readTime = Math.max(1, Math.ceil(minutes));
    return `${readTime} min read`;
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const stripHtml = (html) => {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, "") // Remove tags
        .replace(/&nbsp;/g, " ") // Decode entities
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
};
