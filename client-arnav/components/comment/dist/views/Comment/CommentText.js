"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _lib = require("../../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * A comment can contain text.
 */
function CommentText(props) {
  var className = props.className,
      children = props.children,
      content = props.content;
  var classes = (0, _classnames["default"])(className, 'text');
  var rest = (0, _lib.getUnhandledProps)(CommentText, props);
  var ElementType = (0, _lib.getElementType)(CommentText, props);
  return /*#__PURE__*/_react["default"].createElement(ElementType, _extends({}, rest, {
    className: classes
  }), _lib.childrenUtils.isNil(children) ? content : children);
}

CommentText.handledProps = ["as", "children", "className", "content"];
CommentText.propTypes = {
  /** An element type to render as (string or function). */
  as: _propTypes["default"].elementType,

  /** Primary content. */
  children: _propTypes["default"].node,

  /** Additional classes. */
  className: _propTypes["default"].string,

  /** Shorthand for primary content. */
  content: _lib.customPropTypes.contentShorthand
};
var _default = CommentText;
exports["default"] = _default;

//# sourceMappingURL=CommentText.js.map