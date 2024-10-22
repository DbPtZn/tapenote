/** 检测字符串是否包含英文 */
export function containsEnglish(text: string) {
  // 使用正则表达式匹配英文字符
  const englishRegex = /[a-zA-Z]/;
  // 检查字符串中是否包含英文字符
  return englishRegex.test(text);
}