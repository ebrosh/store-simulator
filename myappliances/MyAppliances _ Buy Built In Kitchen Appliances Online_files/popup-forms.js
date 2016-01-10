$(document).ready(function(){
	
	// Ask a Question
    $('#AskAQuestion').bootstrapValidator({
		live: 'enabled',
        message: 'This value is not valid',
        feedbackIcons: null,
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'Your full name is required and cannot be empty'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'Your email is required and cannot be empty'
                    },
					emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
			enquire: {
                validators: {
                    notEmpty: {
                        message: 'A message is required and cannot be empty'
                    },
					stringLength: {
                        min: '10',
                        message: 'Please provide more detail'
                    }
                }
            }
        }
    });
	
	// Price Match
    $('#PriceMatch').bootstrapValidator({
		live: 'enabled',
        message: 'This value is not valid',
        feedbackIcons: null,
        fields: {
            PMname: {
                validators: {
                    notEmpty: {
                        message: 'Your full name is required and cannot be empty'
                    }
                }
            },
            PMemail: {
                validators: {
                    notEmpty: {
                        message: 'Your email is required and cannot be empty'
                    },
					emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
			PMcomp_url: {
                validators: {
                    notEmpty: {
                        message: 'A URL is required and cannot be empty'
                    },
					uri: {
                        message: 'The input is not a valid URL'
                    }
                }
            },
			PMenquire: {
                validators: {
                    notEmpty: {
                        message: 'A message is required and cannot be empty'
                    },
					stringLength: {
                        min: '10',
                        message: 'Please provide more detail'
                    }
                }
            }
        }
    });
	
	// Ask a Question
    $('#ForgottenPassword').bootstrapValidator({
		live: 'enabled',
        message: 'This value is not valid',
        feedbackIcons: null,
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'Your email is required and cannot be empty'
                    },
					emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            }
        }
    });


});

