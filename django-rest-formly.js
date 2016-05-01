(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.DjangoRestFormly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var fields = require("./fields");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DjangoRestConfig;
var djnagoRestFieldLookup = [
    function (djangoRestMeta) {
        if (djangoRestMeta.choices && djangoRestMeta.choices.length > 0) {
            return "choice";
        }
    },
    function (djangoRestMeta) {
        if (djangoRestMeta.type == "regex") {
            if (djangoRestMeta.pattern == undefined) {
                console.warn('regex field should define pattern property. \'' + djangoRestMeta.name + '\' field will be treated as string.');
                return "string";
            }
            return "regex";
        }
    },
    function (djangoRestMeta) {
        if (djangoRestMeta.type == "string" && djangoRestMeta.max_length == undefined) {
            return "text";
        }
        else if (djangoRestMeta.type == "string") {
            return "string";
        }
    }
];
var DjangoRestConfig = (function () {
    function DjangoRestConfig() {
    }
    DjangoRestConfig.factory = function (djangoRestMeta, factoryFn) {
        var field_class_string = null, fieldClass;
        if (factoryFn) {
            field_class_string = factoryFn(djangoRestMeta);
        }
        if (!field_class_string) {
            for (var i in djnagoRestFieldLookup) {
                var ret = void 0, lookupFn = void 0;
                lookupFn = djnagoRestFieldLookup[i];
                ret = lookupFn(djangoRestMeta);
                if (ret !== null && ret !== undefined) {
                    field_class_string = ret;
                    break;
                }
            }
        }
        if (!field_class_string) {
            field_class_string = djangoRestMeta.type;
        }
        if (typeof field_class_string === "string") {
            field_class_string = DjangoRestConfig._fieldMapping[field_class_string];
        }
        if (!field_class_string) {
            throw TypeError("Can not find an appropriate field for '" + djangoRestMeta.type + "' field");
        }
        fieldClass = field_class_string;
        return new fieldClass(djangoRestMeta);
    };
    DjangoRestConfig.prototype.setType = function (type, fieldClass) {
        DjangoRestConfig._fieldMapping[type] = fieldClass;
    };
    DjangoRestConfig.prototype.getType = function (type) {
        return DjangoRestConfig._fieldMapping[type];
    };
    DjangoRestConfig._fieldMapping = {
        "boolean": fields.BooleanField,
        "integer": fields.NumericField,
        "decimal": fields.DecimalField,
        "float": fields.FloatField,
        "string": fields.CharField,
        "text": fields.TextField,
        "hidden": fields.HiddenField,
        "password": fields.PasswordField,
        "select": fields.SelectField,
        "choice": fields.SelectField,
        "radio": fields.RadioField,
        "regex": fields.RegexField,
        "email": fields.EmailField,
        "url": fields.URLField,
        "ipaddress": fields.IPAddressField,
        "date": fields.DateField,
        "datetime": fields.DateTimeField,
        "time": fields.TimeField,
    };
    return DjangoRestConfig;
})();
exports.DjangoRestConfig = DjangoRestConfig;

},{"./fields":7}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('./base');
var utils = require('../utils');
var CharField = (function (_super) {
    __extends(CharField, _super);
    function CharField(options) {
        _super.call(this, options);
        this.minLength = options.min_length;
        this.maxLength = options.max_length;
    }
    CharField.prototype.getExtraTemplateOptions = function () {
        return utils.smartExtend({}, {
            minlength: this.minLength,
            maxlength: this.maxLength
        });
    };
    CharField.fieldType = 'input';
    CharField.templateType = 'text';
    return CharField;
})(base.Field);
exports.CharField = CharField;
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(options) {
        _super.call(this, options);
        this.rows = 2;
    }
    TextField.prototype.getExtraTemplateOptions = function () {
        return utils.extend(_super.prototype.getExtraTemplateOptions.call(this), {
            rows: this.rows
        });
    };
    TextField.fieldType = 'textarea';
    TextField.templateType = null;
    return TextField;
})(CharField);
exports.TextField = TextField;
var RegexField = (function (_super) {
    __extends(RegexField, _super);
    function RegexField(options) {
        _super.call(this, options);
        this.pattern = options.pattern || this.pattern;
    }
    RegexField.prototype.getExtraTemplateOptions = function () {
        return utils.extend(_super.prototype.getExtraTemplateOptions.call(this), {
            pattern: this.pattern
        });
    };
    return RegexField;
})(CharField);
exports.RegexField = RegexField;
var EmailField = (function (_super) {
    __extends(EmailField, _super);
    function EmailField() {
        _super.apply(this, arguments);
    }
    EmailField.prototype.getExtraTemplateOptions = function () {
        return utils.extend(_super.prototype.getExtraTemplateOptions.call(this), {
            pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$"
        });
    };
    EmailField.templateType = 'email';
    return EmailField;
})(CharField);
exports.EmailField = EmailField;
var PasswordField = (function (_super) {
    __extends(PasswordField, _super);
    function PasswordField() {
        _super.apply(this, arguments);
    }
    PasswordField.templateType = 'password';
    return PasswordField;
})(CharField);
exports.PasswordField = PasswordField;
var HiddenField = (function (_super) {
    __extends(HiddenField, _super);
    function HiddenField() {
        _super.apply(this, arguments);
    }
    HiddenField.templateType = 'hidden';
    return HiddenField;
})(CharField);
exports.HiddenField = HiddenField;
var URLField = (function (_super) {
    __extends(URLField, _super);
    function URLField() {
        _super.apply(this, arguments);
        this.pattern = '(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?';
    }
    URLField.templateType = 'url';
    return URLField;
})(RegexField);
exports.URLField = URLField;
var IPAddressField = (function (_super) {
    __extends(IPAddressField, _super);
    function IPAddressField() {
        _super.apply(this, arguments);
        this.pattern = '^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$';
    }
    return IPAddressField;
})(RegexField);
exports.IPAddressField = IPAddressField;

},{"../utils":9,"./base":5}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('./base');
var ChoiceField = (function (_super) {
    __extends(ChoiceField, _super);
    function ChoiceField(options) {
        _super.call(this, options);
        this.choices = options.choices;
    }
    ChoiceField.prototype.getExtraTemplateOptions = function () {
        var res = {}, options = [];
        if (!this.readOnly && this.choices) {
            this.choices.forEach(function (choice) {
                options.push({
                    name: choice['display_name'],
                    value: choice['value']
                });
            });
            res.options = options;
        }
        return res;
    };
    ChoiceField.templateType = null;
    return ChoiceField;
})(base.Field);
exports.ChoiceField = ChoiceField;
var RadioField = (function (_super) {
    __extends(RadioField, _super);
    function RadioField() {
        _super.apply(this, arguments);
    }
    RadioField.fieldType = 'radio';
    return RadioField;
})(ChoiceField);
exports.RadioField = RadioField;
var SelectField = (function (_super) {
    __extends(SelectField, _super);
    function SelectField() {
        _super.apply(this, arguments);
    }
    SelectField.fieldType = 'select';
    return SelectField;
})(ChoiceField);
exports.SelectField = SelectField;

},{"./base":5}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('./base');
var utils = require('../utils');
var NumericField = (function (_super) {
    __extends(NumericField, _super);
    function NumericField(options) {
        _super.call(this, options);
        this.minValue = options.min_value;
        this.maxValue = options.max_value;
    }
    NumericField.prototype.getExtraTemplateOptions = function () {
        return utils.smartExtend({}, {
            min: this.minValue,
            max: this.maxValue
        });
    };
    NumericField.fieldType = 'input';
    NumericField.templateType = 'number';
    return NumericField;
})(base.Field);
exports.NumericField = NumericField;
var DecimalField = (function (_super) {
    __extends(DecimalField, _super);
    function DecimalField(options) {
        _super.call(this, options);
        this.maxDigits = options.max_digits;
        this.decimalPlaces = options.decimal_places;
    }
    DecimalField.prototype.getExtraTemplateOptions = function () {
        return utils.smartExtend(_super.prototype.getExtraTemplateOptions.call(this), {
            maxlength: this.maxDigits
        });
    };
    DecimalField.fieldType = 'input';
    DecimalField.templateType = 'number';
    return DecimalField;
})(NumericField);
exports.DecimalField = DecimalField;
var FloatField = (function (_super) {
    __extends(FloatField, _super);
    function FloatField() {
        _super.apply(this, arguments);
    }
    FloatField.prototype.getExtraTemplateOptions = function () {
        return utils.smartExtend(_super.prototype.getExtraTemplateOptions.call(this), {
            'step': 'any'
        });
    };
    return FloatField;
})(NumericField);
exports.FloatField = FloatField;

},{"../utils":9,"./base":5}],5:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require('../utils');
var Field = (function () {
    function Field(options) {
        this.name = options.name;
        this.required = options.required || false;
        this.readOnly = options.read_only || false;
        this.defaultValue = options.default;
        this.allow_null = options.allow_null || false;
        this.label = options.label || this.name;
        this.helpText = options.help_text;
        this.choices = options.choices;
    }
    Field.prototype.isBoolean = function () {
        if (this.constructor.fieldType === 'checkbox') {
            return true;
        }
        return false;
    };
    Field.prototype.getExtraTemplateOptions = function () {
        return {};
    };
    Field.prototype.getTemplateOptions = function () {
        var tplOptions = {
            label: this.label,
            type: this.constructor.templateType,
            required: this.required,
            disabled: this.readOnly
        };
        if (!this.isBoolean() && this.allow_null) {
            tplOptions.required = false;
        }
        return utils.smartExtend({}, tplOptions, this.getExtraTemplateOptions());
    };
    Field.prototype.getConfigurationObject = function () {
        var configurationObject = {
            type: this.constructor.fieldType,
            key: this.name,
            templateOptions: this.getTemplateOptions()
        };
        if (this.defaultValue !== undefined) {
            configurationObject.defaultValue = this.defaultValue;
        }
        return configurationObject;
    };
    Field.fieldType = 'input';
    return Field;
})();
exports.Field = Field;
var BooleanField = (function (_super) {
    __extends(BooleanField, _super);
    function BooleanField() {
        _super.apply(this, arguments);
    }
    BooleanField.fieldType = 'checkbox';
    BooleanField.templateType = null;
    return BooleanField;
})(Field);
exports.BooleanField = BooleanField;

},{"../utils":9}],6:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base = require('./base');
var DateField = (function (_super) {
    __extends(DateField, _super);
    function DateField() {
        _super.apply(this, arguments);
    }
    DateField.fieldType = 'input';
    DateField.templateType = 'date';
    return DateField;
})(base.Field);
exports.DateField = DateField;
var TimeField = (function (_super) {
    __extends(TimeField, _super);
    function TimeField() {
        _super.apply(this, arguments);
    }
    TimeField.fieldType = 'input';
    TimeField.templateType = 'time';
    return TimeField;
})(base.Field);
exports.TimeField = TimeField;
var DateTimeField = (function (_super) {
    __extends(DateTimeField, _super);
    function DateTimeField() {
        _super.apply(this, arguments);
    }
    DateTimeField.fieldType = 'input';
    DateTimeField.templateType = 'datetime-local';
    return DateTimeField;
})(base.Field);
exports.DateTimeField = DateTimeField;

},{"./base":5}],7:[function(require,module,exports){
var base_1 = require("./base");
exports.Field = base_1.Field;
exports.BooleanField = base_1.BooleanField;
var CharField_1 = require("./CharField");
exports.CharField = CharField_1.CharField;
exports.TextField = CharField_1.TextField;
exports.EmailField = CharField_1.EmailField;
exports.PasswordField = CharField_1.PasswordField;
exports.HiddenField = CharField_1.HiddenField;
var CharField_2 = require("./CharField");
exports.RegexField = CharField_2.RegexField;
exports.URLField = CharField_2.URLField;
exports.IPAddressField = CharField_2.IPAddressField;
var ChoiceField_1 = require("./ChoiceField");
exports.SelectField = ChoiceField_1.SelectField;
exports.RadioField = ChoiceField_1.RadioField;
var NumericField_1 = require("./NumericField");
exports.NumericField = NumericField_1.NumericField;
exports.DecimalField = NumericField_1.DecimalField;
exports.FloatField = NumericField_1.FloatField;
var datetime_1 = require("./datetime");
exports.DateField = datetime_1.DateField;
exports.TimeField = datetime_1.TimeField;
exports.DateTimeField = datetime_1.DateTimeField;

},{"./CharField":2,"./ChoiceField":3,"./NumericField":4,"./base":5,"./datetime":6}],8:[function(require,module,exports){
var DjangoRestConfig_1 = require("./DjangoRestConfig");
var Converter = (function () {
    function Converter(djangoRestMeta, fieldFactoryFn) {
        this.fields = [];
        for (var fieldName in djangoRestMeta) {
            var fieldConfig = djangoRestMeta[fieldName];
            fieldConfig.name = fieldName;
            this.fields.push(DjangoRestConfig_1.DjangoRestConfig.factory(fieldConfig, fieldFactoryFn));
        }
        ;
    }
    Converter.prototype.convert = function () {
        var configObjects = [];
        this.fields.forEach(function (field) {
            configObjects.push(field.getConfigurationObject());
        });
        return configObjects;
    };
    return Converter;
})();
exports.Converter = Converter;
exports.toFormlyFields = function toFormlyFieldsF(djangoRestMeta, fieldFactoryFn) {
    console.log("toFormlyFields is deprecated, please use toFormly instead");
    var converter = new Converter(djangoRestMeta, fieldFactoryFn);
    return converter.convert();
};
exports.toFormly = function toFormlyF(djangoRestMeta, fieldFactoryFn) {
    var converter = new Converter(djangoRestMeta, fieldFactoryFn);
    return converter.convert();
};

},{"./DjangoRestConfig":1}],9:[function(require,module,exports){
/**
 * angular-formly-rest utilities.
 */
/**
 * Copy all of the properties in the source objects over to the destination
 * object, and return the destination object.
 *
 * @param destination
 * @param sources
 * @returns {Object}
 */
function extend(destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        for (var p in source) {
            destination[p] = source[p];
        }
    });
    return destination;
}
exports.extend = extend;
/**
 * Copy all non null properties in the source objects over to the destination
 * object, and return the destination object.
 *
 * @param destination
 * @param sources
 * @returns {Object}
 */
function smartExtend(destination) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        for (var p in source) {
            if (source[p] !== null && source[p] !== undefined) {
                destination[p] = source[p];
            }
        }
    });
    return destination;
}
exports.smartExtend = smartExtend;

},{}]},{},[8])(8)
});