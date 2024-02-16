const PROMPT = `Think step by step and stay within the context of the image  
- Provide a list of all the following attributes in descending order of the count in RFC8259 compliant JSON format without deviation:
Name, Company, Count
[{
  "name": "name of the product",
  "company": "company name of the product",
  "count": "how many products are there in number",
}]
The JSON response:
`;

module.exports = PROMPT;
