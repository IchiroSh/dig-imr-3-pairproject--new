define(
  "ace/theme/twilight.css",
  ["require", "exports", "module"],
  function (e, t, n) {
    n.exports =
      '.ace-twilight .ace_gutter {\n  background: #232323;\n  color: #E2E2E2\n}\n\n.ace-twilight .ace_print-margin {\n  width: 1px;\n  background: #232323\n}\n\n.ace-twilight {\n  background-color: #141414;\n  color: #F8F8F8\n}\n\n.ace-twilight .ace_cursor {\n  color: #A7A7A7\n}\n\n.ace-twilight .ace_marker-layer .ace_selection {\n  background: rgba(221, 240, 255, 0.20)\n}\n\n.ace-twilight.ace_multiselect .ace_selection.ace_start {\n  box-shadow: 0 0 3px 0px #141414;\n}\n\n.ace-twilight .ace_marker-layer .ace_step {\n  background: rgb(102, 82, 0)\n}\n\n.ace-twilight .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(255, 255, 255, 0.25)\n}\n\n.ace-twilight .ace_marker-layer .ace_active-line {\n  background: rgba(255, 255, 255, 0.031)\n}\n\n.ace-twilight .ace_gutter-active-line {\n  background-color: rgba(255, 255, 255, 0.031)\n}\n\n.ace-twilight .ace_marker-layer .ace_selected-word {\n  border: 1px solid rgba(221, 240, 255, 0.20)\n}\n\n.ace-twilight .ace_invisible {\n  color: rgba(255, 255, 255, 0.25)\n}\n\n.ace-twilight .ace_keyword,\n.ace-twilight .ace_meta {\n  color: #CDA869\n}\n\n.ace-twilight .ace_constant,\n.ace-twilight .ace_constant.ace_character,\n.ace-twilight .ace_constant.ace_character.ace_escape,\n.ace-twilight .ace_constant.ace_other,\n.ace-twilight .ace_heading,\n.ace-twilight .ace_markup.ace_heading,\n.ace-twilight .ace_support.ace_constant {\n  color: #CF6A4C\n}\n\n.ace-twilight .ace_invalid.ace_illegal {\n  color: #F8F8F8;\n  background-color: rgba(86, 45, 86, 0.75)\n}\n\n.ace-twilight .ace_invalid.ace_deprecated {\n  text-decoration: underline;\n  font-style: italic;\n  color: #D2A8A1\n}\n\n.ace-twilight .ace_support {\n  color: #9B859D\n}\n\n.ace-twilight .ace_fold {\n  background-color: #AC885B;\n  border-color: #F8F8F8\n}\n\n.ace-twilight .ace_support.ace_function {\n  color: #DAD085\n}\n\n.ace-twilight .ace_list,\n.ace-twilight .ace_markup.ace_list,\n.ace-twilight .ace_storage {\n  color: #F9EE98\n}\n\n.ace-twilight .ace_entity.ace_name.ace_function,\n.ace-twilight .ace_meta.ace_tag {\n  color: #AC885B\n}\n\n.ace-twilight .ace_string {\n  color: #8F9D6A\n}\n\n.ace-twilight .ace_string.ace_regexp {\n  color: #E9C062\n}\n\n.ace-twilight .ace_comment {\n  font-style: italic;\n  color: #5F5A60\n}\n\n.ace-twilight .ace_variable {\n  color: #7587A6\n}\n\n.ace-twilight .ace_xml-pe {\n  color: #494949\n}\n\n.ace-twilight .ace_indent-guide {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMQERFpYLC1tf0PAAgOAnPnhxyiAAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-twilight .ace_indent-guide-active {\n  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAZSURBVHjaYvj///9/hivKyv8BAAAA//8DACLqBhbvk+/eAAAAAElFTkSuQmCC") right repeat-y;\n}\n';
  }
),
  define(
    "ace/theme/twilight",
    ["require", "exports", "module", "ace/theme/twilight.css", "ace/lib/dom"],
    function (e, t, n) {
      (t.isDark = !0),
        (t.cssClass = "ace-twilight"),
        (t.cssText = e("./twilight.css"));
      var r = e("../lib/dom");
      r.importCssString(t.cssText, t.cssClass, !1);
    }
  );
(function () {
  window.require(["ace/theme/twilight"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
