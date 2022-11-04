define(
  "ace/mode/turtle_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
      i = e("./text_highlight_rules").TextHighlightRules,
      s = function () {
        (this.$rules = {
          start: [
            { include: "#comments" },
            { include: "#strings" },
            { include: "#base-prefix-declarations" },
            { include: "#string-language-suffixes" },
            { include: "#string-datatype-suffixes" },
            { include: "#relative-urls" },
            { include: "#xml-schema-types" },
            { include: "#rdf-schema-types" },
            { include: "#owl-types" },
            { include: "#qnames" },
            { include: "#punctuation-operators" },
          ],
          "#base-prefix-declarations": [
            { token: "keyword.other.prefix.turtle", regex: /@(?:base|prefix)/ },
          ],
          "#comments": [
            {
              token: [
                "punctuation.definition.comment.turtle",
                "comment.line.hash.turtle",
              ],
              regex: /(#)(.*$)/,
            },
          ],
          "#owl-types": [
            {
              token: "support.type.datatype.owl.turtle",
              regex: /owl:[a-zA-Z]+/,
            },
          ],
          "#punctuation-operators": [
            {
              token: "keyword.operator.punctuation.turtle",
              regex: /;|,|\.|\(|\)|\[|\]/,
            },
          ],
          "#qnames": [
            {
              token: "entity.name.other.qname.turtle",
              regex: /(?:[a-zA-Z][-_a-zA-Z0-9]*)?:(?:[_a-zA-Z][-_a-zA-Z0-9]*)?/,
            },
          ],
          "#rdf-schema-types": [
            {
              token: "support.type.datatype.rdf.schema.turtle",
              regex: /rdfs?:[a-zA-Z]+|(?:^|\s)a(?:\s|$)/,
            },
          ],
          "#relative-urls": [
            {
              token: "string.quoted.other.relative.url.turtle",
              regex: /</,
              push: [
                {
                  token: "string.quoted.other.relative.url.turtle",
                  regex: />/,
                  next: "pop",
                },
                { defaultToken: "string.quoted.other.relative.url.turtle" },
              ],
            },
          ],
          "#string-datatype-suffixes": [
            { token: "keyword.operator.datatype.suffix.turtle", regex: /\^\^/ },
          ],
          "#string-language-suffixes": [
            {
              token: [
                "keyword.operator.language.suffix.turtle",
                "constant.language.suffix.turtle",
              ],
              regex: /(?!")(@)([a-z]+(?:\-[a-z0-9]+)*)/,
            },
          ],
          "#strings": [
            {
              token: "string.quoted.triple.turtle",
              regex: /"""/,
              push: [
                {
                  token: "string.quoted.triple.turtle",
                  regex: /"""/,
                  next: "pop",
                },
                { defaultToken: "string.quoted.triple.turtle" },
              ],
            },
            {
              token: "string.quoted.double.turtle",
              regex: /"/,
              push: [
                {
                  token: "string.quoted.double.turtle",
                  regex: /"/,
                  next: "pop",
                },
                { token: "invalid.string.newline", regex: /$/ },
                { token: "constant.character.escape.turtle", regex: /\\./ },
                { defaultToken: "string.quoted.double.turtle" },
              ],
            },
          ],
          "#xml-schema-types": [
            {
              token: "support.type.datatype.xml.schema.turtle",
              regex: /xsd?:[a-z][a-zA-Z]+/,
            },
          ],
        }),
          this.normalizeRules();
      };
    (s.metaData = {
      fileTypes: ["ttl", "nt"],
      name: "Turtle",
      scopeName: "source.turtle",
    }),
      r.inherits(s, i),
      (t.TurtleHighlightRules = s);
  }
),
  define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./fold_mode").FoldMode,
        o = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(o, s),
        function () {
          (this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/),
            (this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/),
            (this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/),
            (this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/),
            (this._getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n);
              if (
                this.singleLineBlockCommentRe.test(r) &&
                !this.startRegionRe.test(r) &&
                !this.tripleStarBlockCommentRe.test(r)
              )
                return "";
              var i = this._getFoldWidgetBase(e, t, n);
              return !i && this.startRegionRe.test(r) ? "start" : i;
            }),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var i = e.getLine(n);
              if (this.startRegionRe.test(i))
                return this.getCommentRegionBlock(e, i, n);
              var s = i.match(this.foldingStartMarker);
              if (s) {
                var o = s.index;
                if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return (
                  u &&
                    !u.isMultiLine() &&
                    (r
                      ? (u = this.getSectionRange(e, n))
                      : t != "all" && (u = null)),
                  u
                );
              }
              if (t === "markbegin") return;
              var s = i.match(this.foldingStopMarker);
              if (s) {
                var o = s.index + s[0].length;
                return s[1]
                  ? this.closingBracketBlock(e, s[1], n, o)
                  : e.getCommentFoldRange(n, o, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              var n = e.getLine(t),
                r = n.search(/\S/),
                s = t,
                o = n.length;
              t += 1;
              var u = t,
                a = e.getLength();
              while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1) continue;
                if (r > f) break;
                var l = this.getFoldWidgetRange(e, "all", t);
                if (l) {
                  if (l.start.row <= s) break;
                  if (l.isMultiLine()) t = l.end.row;
                  else if (r == f) break;
                }
                u = t;
              }
              return new i(s, o, u, e.getLine(u).length);
            }),
            (this.getCommentRegionBlock = function (e, t, n) {
              var r = t.search(/\s*$/),
                s = e.getLength(),
                o = n,
                u = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/,
                a = 1;
              while (++n < s) {
                t = e.getLine(n);
                var f = u.exec(t);
                if (!f) continue;
                f[1] ? a-- : a++;
                if (!a) break;
              }
              var l = n;
              if (l > o) return new i(o, r, l, t.length);
            });
        }.call(o.prototype);
    }
  ),
  define(
    "ace/mode/turtle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/mode/turtle_highlight_rules",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      "use strict";
      var r = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./turtle_highlight_rules").TurtleHighlightRules,
        o = e("./folding/cstyle").FoldMode,
        u = function () {
          (this.HighlightRules = s), (this.foldingRules = new o());
        };
      r.inherits(u, i),
        function () {
          this.$id = "ace/mode/turtle";
        }.call(u.prototype),
        (t.Mode = u);
    }
  );
(function () {
  window.require(["ace/mode/turtle"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
