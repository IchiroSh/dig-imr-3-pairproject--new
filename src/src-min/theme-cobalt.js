define(
  "ace/theme/cobalt.css",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      '.ace-cobalt .ace_gutter {\n  background: #011e3a;\n  color: rgb(128,145,160)\n}\n\n.ace-cobalt .ace_print-margin {\n  width: 1px;\n  background: #555555\n}\n\n.ace-cobalt {\n  background-color: #002240;\n  color: #FFFFFF\n}\n\n.ace-cobalt .ace_cursor {\n  color: #FFFFFF\n}\n\n.ace-cobalt .ace_marker-layer .ace_selection {\n  background: rgba(179, 101, 57, 0.75)\n}\n\n.ace-cobalt.ace_multiselect .ace_selection.ace_start {\n  box-shadow: 0 0 3px 0px #002240;\n}\n\n.ace-cobalt .ace_marker-layer .ace_step {\n  background: rgb(127, 111, 19)\n}\n\n.ace-cobalt .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(255, 255, 255, 0.15)\n}\n\n.ace-cobalt .ace_marker-layer .ace_active-line {\n  background: rgba(0, 0, 0, 0.35)\n}\n\n.ace-cobalt .ace_gutter-active-line {\n  background-color: rgba(0, 0, 0, 0.35)\n}\n\n.ace-cobalt .ace_marker-layer .ace_selected-word {\n  border: 1px solid rgba(179, 101, 57, 0.75)\n}\n\n.ace-cobalt .ace_invisible {\n  color: rgba(255, 255, 255, 0.15)\n}\n\n.ace-cobalt .ace_keyword,\n.ace-cobalt .ace_meta {\n  color: #FF9D00\n}\n\n.ace-cobalt .ace_constant,\n.ace-cobalt .ace_constant.ace_character,\n.ace-cobalt .ace_constant.ace_character.ace_escape,\n.ace-cobalt .ace_constant.ace_other {\n  color: #FF628C\n}\n\n.ace-cobalt .ace_invalid {\n  color: #F8F8F8;\n  background-color: #800F00\n}\n\n.ace-cobalt .ace_support {\n  color: #80FFBB\n}\n\n.ace-cobalt .ace_support.ace_constant {\n  color: #EB939A\n}\n\n.ace-cobalt .ace_fold {\n  background-color: #FF9D00;\n  border-color: #FFFFFF\n}\n\n.ace-cobalt .ace_support.ace_function {\n  color: #FFB054\n}\n\n.ace-cobalt .ace_storage {\n  color: #FFEE80\n}\n\n.ace-cobalt .ace_entity {\n  color: #FFDD00\n}\n\n.ace-cobalt .ace_string {\n  color: #3AD900\n}\n\n.ace-cobalt .ace_string.ace_regexp {\n  color: #80FFC2\n}\n\n.ace-cobalt .ace_comment {\n  font-style: italic;\n  color: #0088FF\n}\n\n.ace-cobalt .ace_heading,\n.ace-cobalt .ace_markup.ace_heading {\n  color: #C8E4FD;\n  background-color: #001221\n}\n\n.ace-cobalt .ace_list,\n.ace-cobalt .ace_markup.ace_list {\n  background-color: #130D26\n}\n\n.ace-cobalt .ace_variable {\n  color: #CCCCCC\n}\n\n.ace-cobalt .ace_variable.ace_language {\n  color: #FF80E1\n}\n\n.ace-cobalt .ace_meta.ace_tag {\n  color: #9EFFFF\n}\n\n.ace-cobalt .ace_indent-guide {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHCLSvkPAAP3AgSDTRd4AAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-cobalt .ace_indent-guide-active {\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAZSURBVHjaYvj///9/hivKyv8BAAAA//8DACLqBhbvk+/eAAAAAElFTkSuQmCC") right repeat-y;\n}\n';
  }
),
  define(
    "ace/theme/cobalt",
    ["require", "exports", "module", "ace/theme/cobalt.css", "ace/lib/dom"],
    function (e, t, n) {
      (t.isDark = !0),
        (t.cssClass = "ace-cobalt"),
        (t.cssText = e("./cobalt.css"));
      var r = e("../lib/dom");
      r.importCssString(t.cssText, t.cssClass, !1);
    }
  );
(function () {
  window.require(["ace/theme/cobalt"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
