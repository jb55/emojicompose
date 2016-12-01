
var emojis = require('./emoji.json')
var maxLen = +process.argv[2] || 6;

function e2u(str){
    str = str.replace(/\ufe0f|\u200d/gm, ''); // strips unicode variation selector and zero-width joiner
    var i = 0, c = 0, p = 0, r = [];
    while (i < str.length){
        c = str.charCodeAt(i++);
        if (p){
            r.push((65536+(p-55296<<10)+(c-56320)).toString(16));
            p = 0;
        } else if (55296 <= c && c <= 56319){
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }
    return r.join('-').toUpperCase();
}

function safeChar(c) {
  switch(c) {
    case '+': return "plus"; break;
    case '-': return "minus"; break;
  }
  return c;
}

var used = {};
function isntUsed(alias) {
  return used[alias] !== 1;
}

emojis.forEach(function (x) {
  if (!x.emoji) return;
  var codepoint = "U"+e2u(x.emoji);
  var word = x.aliases.find(isntUsed);
  if (word == null) 
    throw Error("could not find unambiguous alias for: " + x.description)
  used[word] = 1;
  var words = [].filter.call(word, (x) => x != "_")
                .map((x) => "<" + safeChar(x) + ">")
  if (words.length > maxLen || codepoint.indexOf("-") != -1)
    return;
  var desc = word == x.description ? "" : x.description
  console.log("<Multi_key> %s : \"%s\" %s # \"%s\" %s"
             , words.join(" ")
             , x.emoji
             , codepoint
             , word
             , desc
             )
})

