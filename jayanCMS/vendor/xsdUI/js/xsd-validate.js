/*
 * 水滴管家表单验证 xsd-validate.js 1.0.1
 * Copyright (c) 2016 - 2020 Carlos Lee, http://h2ome.cn
 * Portions of xsd-validate are inspired by jquery-validator.js.
 */

(function (window, document, $) {

  /*
   * tips and callback
   */

  var config = {
    messages: {
      required: '请输入%s .',
      matches: ' %s不等于%s字段.',
      eq: ' %s默认提示',
      email: '请填写正确的邮箱地址.',
      phone:'请输入正确的手机号.',
      cardId:'请输入正确的身份证号.',
      min: '%s不能少于 %s 字.',
      max: '%s不能超过 %s 字.',
      exact: '%s必须是%s个字.',
      greater: '%s必须大于%s.',
      less: '%s不能大于30天.',
      numeric: '%s只能是数字.',
      letter:'%s只能是字母.'
    },
    callback: function (errors) {
      //remove all tips
      $('.error-tips').remove();
      for (var e in errors) {
        error = errors[e];
        tipFunc(error.element, error.message);
      }

      // 跳转回第一个错误提示的位置
      if ($('.error-tips').length > 0) {
        var _label = $('.error-tips')[0],
            $label = $(_label).parentsUntil('.xsd-clearfix'),
            pos    = Math.abs($label.position().top);
        console.log($label, $label.position());
        $(".xsd-modal").scrollTop(pos);
      }

    }
  };
  /*
   * TODO
   */
  var tipFunc = function (element, msg) {
    var errorTip = document.createElement('label');
    errorTip.innerHTML = msg;
    errorTip.className = 'error-tips';
    if ($(element).next('label').length == 0) {
      $(element).after(errorTip);
    } else {
      $(element).next('label').html(msg);
    }
  }
  /*
   * reg.
   */

  var ruleRegex = /^(.+?)\[(.+)\]$/,
    numericRegex = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([1-9]*[1-9][0-9]*\.[0-9]+)|0|([1-9]*[1-9][0-9]*))$/,
    integerRegex = /^\-?[0-9]+$/,
    decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
    emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    mobile = /^1[3,5,8,4,7]\d{9}$/,
    cardId = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    letterRegex=/^[a-zA-Z]+$/

  /*
   * 验证主对象
   *
   * @param fields - Array - [{
   *     name: input name
   *     display: 'Field Name'
   *     rules: required|matches[password_confirm]
   * }]
   * @param callback - 验证不通过回掉函数
   *     @argument errors - An array of validation errors
   */

  var Validator = function (formNode, fields, callback) {
      this.callback = callback || config.callback;
      this.errors = [];
      this.fields = {};
      this.form = formNode.get()[0];
      this.elements = formNode.find('input,textarea').get();
      this.messages = {};
      this.handlers = {};
      this.conditionals = {};
      if (fields === undefined) {
        fields = [];
      }
      // Scan dom attrribute to add fields;

      for (var i = 0; i < this.elements.length; i++) {
        var field = this.elements[i],
          validate = field.getAttribute('validate');
        // no need validate , skip
        if (validate == null) {
          continue;
        }
        //build field
        if (validate.length > 0) {
          field.rules = validate;
        } else {
          field.rules = 'required';
        }
        field.display = field.title || '';
        field.message = field.getAttribute('msg') || null;
        // field check
        if (!field.name || !field.rules) {
          console.warn('xsd-validate.js: The following field miss a configuration:');
          console.warn(field);
          continue;
        }

        this._addField(field, field.name);
      }

    },

    attributeValue = function (element, attributeName) {
      var i;

      if ((element.length > 0) && (element[0].type === 'radio' || element[0].type === 'checkbox')) {
        for (i = 0, elementLength = element.length; i < elementLength; i++) {
          if (element[i].checked) {
            return element[i][attributeName];
          }
        }

        return;
      }

      return element[attributeName];
    };

  /*
   * @public
   * SetMessage
   */

  Validator.prototype.setMessage = function (rule, message) {
    this.messages[rule] = message;
    return this;
  };

  /*
   * @private
   * Add a field to the master fields.
   */

  Validator.prototype._addField = function (field, nameValue) {
    this.fields[nameValue] = field;
  };

  /*
   * @private
   * Main Validate entrance.
   */

  Validator.prototype._validateForm = function () {
    this.errors = [];

    for (var key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
        var field = this.fields[key];
        /*
         * Validate field
         */
        this._validateField(field);
      }
    }


    if (typeof this.callback === 'function') {
      this.callback(this.errors);
    }

    if(this.errors.length>0){
      return false;
    }
    return true;
  };

  /*
   * @private
   * Validate field
   */

  Validator.prototype._validateField = function (field) {
    var i, j,
      rules = field.rules.split('|'),
      indexOfRequired = field.rules.indexOf('required'),
      isEmpty = (!field.value || field.value === '' || field.value === undefined);

    /*
     * Run through the validate.
     */

    for (i = 0, ruleLength = rules.length; i < ruleLength; i++) {

      var method = rules[i],
        param = null,
        failed = false,
        parts = ruleRegex.exec(method);

      /*
       * If this field is not required and the value is empty, continue.
       */

      if (indexOfRequired === -1 && isEmpty) {
        continue;
      }

      /*
       * If the rule has a parameter (such as matches[param]) split it out
       */

      if (parts) {
        method = parts[1];
        param = parts[2];
      }

      if (method.charAt(0) === '!') {
        method = method.substring(1, method.length);
      }

      /*
       * If the hook is defined, run it to find any validation errors
       */

      if (typeof this._hooks[method] === 'function') {
        if (!this._hooks[method].apply(this, [field, param])) {
          failed = true;
        }
      } else if (method.substring(0, 9) === 'callback_') {
        // Custom method. Execute the handler if it was registered
        method = method.substring(9, method.length);

        if (typeof this.handlers[method] === 'function') {
          if (this.handlers[method].apply(this, [field.value, param, field]) === false) {
            failed = true;
          }
        }
      }

      /*
       * If failed, add a message to this.errors.
       */

      if (failed) {
        // Message
        var message = field.message;
        if (!message || method == 'required') {
          var source = this.messages[field.name + '.' + method] || this.messages[method] || config.messages[method];
          message = '字段' + field.display + '填写不正确.';

          if (source) {
            message = source.replace('%s', field.display);

            if (param) {
              message = message.replace('%s', (this.fields[param]) ? this.fields[param].display : param);
            }
          }
        }

        var existingError;
        for (j = 0; j < this.errors.length; j += 1) {
          if (field.name === this.errors[j].name) {
            existingError = this.errors[j];
          }
        }

        var errorObject = existingError || {
            display: field.display,
            element: field,
            name: field.name,
            message: message,
            messages: [],
            rule: method
          };
        errorObject.messages.push(message);
        if (!existingError) this.errors.push(errorObject);
      }
    }
  };
  /*
   * @public
   * Exposed validate method;
   */
  Validator.prototype.valid = function () {
    return this._validateForm();
  }
  /*
   * @private
   * validation
   */

  Validator.prototype._hooks = {
    required: function (field) {
      var value = field.value;

      if ((field.type === 'checkbox') || (field.type === 'radio')) {
        return (field.checked === true);
      }

      return (value !== null && value !== '');
    },

    eq: function (field, defaultName) {
      return field.value !== defaultName;
    },

    matches: function (field, matchName) {
      var el = $(this.form).find('[name=%s]'.replace('%s', matchName)).get()[0];

      if (el) {
        return field.value === el.value;
      }

      return false;
    },

    email: function (field) {
      return emailRegex.test(field.value);
    },

    phone: function (field) {
      return mobile.test(field.value);
    },

    cardId: function (field) {
      return cardId.test(field.value);
    },

    letter: function (field) {
      return letterRegex.test(field.value);
    },

    min: function (field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length >= parseInt(length, 10));
    },

    max: function (field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length <= parseInt(length, 10));
    },

    exact: function (field, length) {
      if (!numericRegex.test(length)) {
        return false;
      }

      return (field.value.length === parseInt(length, 10));
    },

    greater: function (field, param) {

      if (!decimalRegex.test(field.value)) {
        return false;
      }

      return (parseInt(field.value) > parseInt(param));
    },

    less: function (field, param) {
      // if (!decimalRegex.test(field.value)) {
      //   return false;
      // }

      return (parseInt(field.value)<= parseInt(field.max));;
    },

    numeric: function (field) {
      return (numericRegex.test(field.value));
    },

    integer: function (field) {
      return (integerRegex.test(field.value));
    },

    decimal: function (field) {
      return (decimalRegex.test(field.value));
    }
  };

  window.Validator = Validator;

  /*
   * jQuery plugins
   */

  $.fn.validator = function (fields) {
    return new Validator(this);
  };
  $.fn.validate = function (fields) {
    return new Validator(this).valid();
  };
})(window, document, jQuery);
