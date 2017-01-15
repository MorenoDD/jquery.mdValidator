/*
*
* mdValidator.js
* v1.0.1
*
* Author: Moreno Di Domenico
* http://morenodd.com
* hello@morenodd.com
*
*/
(function($) {

    $.mdValidator = function($el, $options) {

        var $options = $.extend({}, $.mdValidator.defaults, $options);

        var $form = $($el);
        var $validForm;

    	var $methods = {
    		init: function(){
    			$methods.resetErrors();
    			$methods.onSubmit();
    		},
    		resetErrors: function(){
				$form.find('input, select, textarea').on('change', function(){
					$(this).parents('.'+$options.fieldClass).removeClass($options.errorClass);
				});
    		},
    		validateFields: function(){
    			$validForm = true;
    			$form.find('input, select, textarea').removeClass($options.errorClass).each(function(i, e){
					var $field = $(e);
					var $rules = $field.attr('data-rules');
					var $value = $field.val();

					if($rules)
					{
						$rules = $rules.split('|');

						for($r in $rules){
							$rule = $rules[$r].replace(/ *\([^)]*\) */g, "");

							switch($rule){
								case 'required':
									$methods.validator.required($field, $value);
								break;

								case 'email':
									$methods.validator.email($field, $value);
								break;

								case 'minlength':
									$attr = $methods.ruleAttribute($rules[$r]);
									$methods.validator.minlength($field, $value, $attr);
								break;

								case 'not':
									$attr = $methods.ruleAttribute($rules[$r]);
									$methods.validator.not($field, $value, $attr);
								break;

                                case 'equal':
                                    $attr = $methods.ruleAttribute($rules[$r]);
                                    $methods.validator.equal($field, $value, $attr);
                                break;

                                case 'format':
                                    $attr = $methods.ruleAttribute($rules[$r]);
                                    $methods.validator.format($field, $value, $attr);
                                break;
							}
						}
					}
    			});

    			return $validForm;
    		},
    		validator: {
    			required: function($field, $value){
    				$value = $value.trim();
    				if(!$value.length){
    					$methods.addError($field);
    				}
    			},
    			email: function($field, $value){
					function validateEmail(email) {
					    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					    return re.test(email);
					}

    				if(!validateEmail($value)){
    					$methods.addError($field);
    				}
    			},
    			minlength: function($field, $value, $attr){
    				if($value.length < $attr){
    					$methods.addError($field);
    				}
    			},  			
    			not: function($field, $value, $attr){
    				if($value === $attr){
    					$methods.addError($field);
    				}
    			},
      			equal: function($field, $value, $attr){
      				$compare = $('[name="'+$attr+'"]');

    				if($value !== $compare.val()){
    					$methods.addError($field);
    				}
    			},
                format: function($field, $value, $attr){
                    var $jolly = 'x';
                    var $valid = true;
                    for (var $i = 0, $len = $attr.length; $i < $len; $i++) {
                        if($attr[$i] !== $jolly && $value[$i] !== $attr[$i]){
                            $valid = false;
                        }
                    }
                    if($value.length !== $attr.length){
                        $valid = false;
                    }
                    if(!$valid){
                        $methods.addError($field);
                    }
                }
    		},
    		ruleAttribute: function($attr){
				var $regex = new RegExp('\\((.*?)\\)', 'g');
				$attr = $regex.exec($attr);
				return ($attr[1]);
    		},
    		addError: function($field){
				$field.parents('.'+$options.fieldClass).addClass($options.errorClass);
				$validForm = false;
    		},
    		onSubmit: function(){
    			$form.on('submit', function(){

                    $options.onBefore($form);

					if($methods.validateFields()){
	    				$options.onSuccess($form);
                        if($options.ajax){
                            return false;
                        }
	    			} else {
                        $options.onError($form);
                        return false;
                    }
    			});
    		}
    	};

    	$methods.init();
    }

    $.mdValidator.defaults = {
    	fieldClass: 'field',
    	errorClass: 'error',
        ajax: true,
        onSuccess: function($form) {},
        onError: function($form) {},
        onBefore: function($form) {},
        onAfter: function($form) {}
    };

	$.fn.mdValidator = function($options) {
		if ($options === undefined) { $options = {}; }

		return this.each(function() {
		    var $this = $(this);

		    new $.mdValidator(this, $options);
		});
	}

}(jQuery));