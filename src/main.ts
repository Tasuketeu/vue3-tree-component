import { createApp } from 'vue';
import App from './App.vue';

import { LicenseManager } from 'ag-grid-enterprise';

LicenseManager.setLicenseKey(
	'[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-112772}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{25 December 2025}____[v3]_[0102]_MTc2NjYyMDgwMDAwMA==e9f738c78bb79818b7ac9e0d9700902b'
);

import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AllCommunityModule } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

createApp(App).mount('#app');
