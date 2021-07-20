const { format_date, format_plural, format_url } = require("../utils/helpers")

test("format_date() returns a date string", () => {
    const date = new Date('2020-03-20 16:12:03')
    expect(format_date(date)).toBe("3/20/2020")
});

test("format_plural returns plural word when provided greater than one", () => {
    expect(format_plural("comment", 1)).toBe("comment")
    expect(format_plural("comment", 2)).toBe("comments")
});

test("format_url returns simplified url string", () => {
    const url1 = format_url("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    const url2 = format_url("https://www.reddit.com/r/rickroll/comments/onx102/pogastley/");
    expect(url1).toBe("youtube.com");
    expect(url2).toBe("reddit.com");
})