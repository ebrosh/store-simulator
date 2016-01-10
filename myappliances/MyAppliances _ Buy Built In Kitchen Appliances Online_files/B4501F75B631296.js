(function(){
	"use strict";
	var eKomiIsOlderIE=false;
	if(/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
		var eKomiIEVersion=new Number(RegExp.$1);
		if(eKomiIEVersion<=6){
			eKomiIsOlderIE=true;
		};
	};
	var eKomiWidgetTexts = new Array ('', 'Its all fine', 'Very happy with ordering , appliance and after care contact', 'Everything was ok. I would easily recommend my appliances. I am happy with the product and with the service from the shop.', 'Excellent price &amp;  service ,good coms ,fast delivery as promised,Would not hesitate to use this company again.   Got follow up call a short while later to make sure everything was OK with product  Very Highly Recommended A+++++', 'The service we have received from the staff at my appliances has been second to none, from the moment we enquired to place the order to when it was despatched and also the after service care as we needed replacement parts which were sent to us at no extra charge.  Every time we have called staff have been polite and go the extra mile to ensure that your needs are meet and nothing is too much trouble.  I will be recommending this company to friends and family.  The equipment we ordered is stylish and fits well into my new kitchen.', 'Very helpful personal service - good communications about delivery times.', 'The appliance I ordered was damaged in transit, one  telephone call, a photo off damage, and a replacement  within a week, brilliant response, I would certainly  recommend MYAPPLIANCES to anyone.', 'I would recommend to others great product very happy with your services.', 'Very good service price and product', 'very pleased with cooker hood good value for the price');
	if(typeof eKomiIntegrationConfig != "undefined") {
		for (var eKomiIntegrationLoop=0;eKomiIntegrationLoop<eKomiIntegrationConfig.length;eKomiIntegrationLoop++){
			if(eKomiIntegrationConfig[eKomiIntegrationLoop].certId == 'B4501F75B631296') {
				if(typeof eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets == "undefined" || eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets.length <=0) {
					// not there or empty? So we search for the default
					eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets = new Array('eKomiWidget_default');
				};
				// START loop for widgets
				if(eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets) {
					for (var eKomiWidgetLoopTargets=0;eKomiWidgetLoopTargets<eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets.length;eKomiWidgetLoopTargets++){
						if(document.getElementById(eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets[eKomiWidgetLoopTargets])) {
							var eKomiWidgetRandomnes = Math.floor(Math.random()*10)+1; // (0.01 to 0.9) * 10 +1 = 1-10
							
							var eKomiWidgetElementText = document.createElement('textNode');
							eKomiWidgetElementText.innerHTML = 'Customer review: ' + eKomiWidgetTexts[eKomiWidgetRandomnes];
							
							var eKomiWidgetElementImg = document.createElement('img');
							eKomiWidgetElementImg.border = '0';
							eKomiWidgetElementImg.src = (document.location.protocol=='https:'?'https:':'http:') + '//connect.ekomi.de/widget/' + eKomiIntegrationConfig[eKomiIntegrationLoop].certId + '-' + eKomiWidgetRandomnes + '.gif';
							eKomiWidgetElementImg.alt = eKomiWidgetElementText.innerHTML;
							
							var eKomiWidgetElement = document.createElement('a');
							eKomiWidgetElement.id = 'eKomiWidget_' + eKomiIntegrationConfig[eKomiIntegrationLoop].certId + '_' + eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets[eKomiWidgetLoopTargets];
							eKomiWidgetElement.appendChild(eKomiWidgetElementImg);
							eKomiWidgetElement.href = 'https://www.ekomi.co.uk/review-myappliancescouk.html';
							eKomiWidgetElement.onclick = Function('window.open(this.href, "_blank", ""); return false;');
							eKomiWidgetElement.title = eKomiWidgetElementText.innerHTML;
							
							var eKomiWidgetTarget = document.getElementById(eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets[eKomiWidgetLoopTargets]);
							while(eKomiWidgetTarget.lastChild) {eKomiWidgetTarget.removeChild(eKomiWidgetTarget.lastChild); };
							eKomiWidgetTarget.appendChild(eKomiWidgetElement);
						}else{
							if('console' in window){ console.warn('connectEkomiIntegration_B4501F75B631296 - Cannot find elementId("' + eKomiIntegrationConfig[eKomiIntegrationLoop].widgetTargets[eKomiWidgetLoopTargets] + '") - skipping'); }
						};
					};
				};
				// END loop for widgets
				
				if(typeof eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets == "undefined" || eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets.length <=0) {
					// not there or empty? So we search for the default
					eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets = new Array('eKomiSeal_default');
				};
				// START loop for seals
				if(eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets) {
					for (var eKomiSealLoopTargets=0;eKomiSealLoopTargets<eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets.length;eKomiSealLoopTargets++){
						if(document.getElementById(eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets[eKomiSealLoopTargets])) {
							var eKomiSealElementText = document.createElement('textNode');
							eKomiSealElementText.innerHTML = 'Customer review: ';
							
							var eKomiSealElementImg = document.createElement('img');
							eKomiSealElementImg.border = '0';
							eKomiSealElementImg.src = (document.location.protocol=='https:'?'https:':'http:') + '//connect.ekomi.de/seal/' + eKomiIntegrationConfig[eKomiIntegrationLoop].certId + '-70x70.' + (eKomiIsOlderIE==true?'gif':'png');
							eKomiSealElementImg.alt = eKomiSealElementText.innerHTML;
							
							var eKomiSealElement = document.createElement('a');
							eKomiSealElement.id = 'eKomiSeal_' + eKomiIntegrationConfig[eKomiIntegrationLoop].certId + '_' + eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets[eKomiSealLoopTargets];
							eKomiSealElement.appendChild(eKomiSealElementImg);
							eKomiSealElement.href = 'https://www.ekomi.co.uk/review-myappliancescouk.html';
							eKomiSealElement.onclick = Function('window.open(this.href, "_blank", ""); return false;');
							eKomiSealElement.title = eKomiSealElementText.innerHTML;
							
							var eKomiSealTarget = document.getElementById(eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets[eKomiSealLoopTargets]);
							while(eKomiSealTarget.lastChild) {eKomiSealTarget.removeChild(eKomiSealTarget.lastChild); };
							eKomiSealTarget.appendChild(eKomiSealElement);
						}else{
							if('console' in window){ console.warn('connectEkomiIntegration_B4501F75B631296 - Cannot find elementId("' + eKomiIntegrationConfig[eKomiIntegrationLoop].sealTargets[eKomiSealLoopTargets] + '")  - skipping'); }
						};
					};
				};
				// END loop for seals
			}else{ 
				// im not in charge of this certID!
			};
		};
	}else{
		if('console' in window){ console.error('connectEkomiIntegration_B4501F75B631296 - Cannot read eKomiIntegrationConfig'); }
	}
}());
			