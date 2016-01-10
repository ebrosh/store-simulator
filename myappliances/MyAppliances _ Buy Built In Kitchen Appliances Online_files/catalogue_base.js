
var catalogue_variables = Array(9);
catalogue_variables['category_id']=0;
catalogue_variables['query']=''; // set in <head>
catalogue_variables['applied_filters']='';
catalogue_variables['order']='PLH';
catalogue_variables['page_number']=1;
catalogue_variables['items_per_page'] = 200;
catalogue_variables['switcher'] = '';
catalogue_variables['BrandID'] = '';
catalogue_variables['BrandID_URL'] = '';

function switcherStyleChanged(currentCSS) {
    //alert(currentCSS);
    catalogue_variables['switcher'] = currentCSS;
}
