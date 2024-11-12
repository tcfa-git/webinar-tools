<script>
	console.log("FULL-DAY-WF-REG-EverySaturday-GHL.js loaded");
if (typeof getURLParameter === 'undefined') {
    const getURLParameter = (param) => {
        const params = new URLSearchParams(window.location.search);
        let result = params.get(param);
        if (result === null || result === 'null' || result.trim() === '' || result.startsWith('&')) {
            result = null;
        } else if (result.includes('=&') || result.startsWith('&')) {
            result = null;
        } else {
            result = decodeURIComponent(result).trim();
        }
        console.log(`Parameter "${param}":`, result);
        return result ? result : null;
    };
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded event fired");

    const sessionID = "61247";
    const widgetID = "68408";
    const widgetVersionID = "119142";
    const widgetName = "Embed";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let medium = null;

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    // Retrieve URL parameters and cookies for UTM tracking
    const params = {
        affiliate: getURLParameter('affiliate'),
        aff_unique1: getURLParameter('aff_unique1'),
        utm_source: getURLParameter('utm_source'),
        utm_medium: getURLParameter('utm_medium'),
        utm_campaign: getURLParameter('utm_campaign'),
        utm_term: getURLParameter('utm_term'),
        utm_content: getURLParameter('utm_content')
    };
    console.log('Retrieved URL Parameters:', params);

    // Determine the medium source from URL parameters or cookies
    if (params.affiliate && params.affiliate !== 'null' && params.affiliate !== '0' && !params.affiliate.startsWith('&')) {
        medium = params.affiliate;
        console.log('Medium set to affiliate:', medium);
    } else if (params.aff_unique1 && params.aff_unique1 !== 'null' && !params.aff_unique1.startsWith('&')) {
        medium = params.aff_unique1;
        console.log('Medium set to aff_unique1:', medium);
    } else if (params.utm_medium && params.utm_medium !== 'null') {
        medium = params.utm_medium;
        console.log('Medium set to utm_medium:', medium);
    } else {
        const cookieAffiliate = getCookie('affiliate');
        const cookieAffUnique1 = getCookie('aff_unique1');
        medium = cookieAffiliate || cookieAffUnique1 || "default_value";
        console.log('Medium set to cookie or default:', medium);
    }

    // Locate the form and add submit event listener
    const form = document.getElementById('inf_form_b361bce2c12af76299e53b35c8877cf4');
    if (form) {
        console.log('Form element found:', form);
        form.addEventListener('submit', async function (event) {
            console.log('Form submission detected');

            // Retrieve form field values
            const email = document.getElementById('inf_field_Email')?.value;
            let phone = document.getElementById('inf_field_Phone1')?.value.trim();
            const firstName = document.getElementById('inf_field_FirstName')?.value || "Unknown";
            const lastName = document.getElementById('inf_field_LastName')?.value || "Unknown";

            if (!email) {
                console.error("Error: Email field not found or empty.");
                return;
            }

            console.log('Collected Form Data:', { email, phone, firstName, lastName });

            const json = {
                version_id: widgetVersionID,
                recaptcha_action: "wf_verify_recaptcha",
                viewer: {
                    webinar_session_id: sessionID,
                    time_zone: timezone,
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    lead: false,
                    registration_source_widget_type: "embed",
                    registration_source_widget_name: widgetName,
                    widget_id: widgetID,
                    widget_version_id: widgetVersionID,
                    source: params.utm_source || "Affiliate_RegPage",
                    utm_medium: medium,
                    custom_fields: {},
                    custom_tracking_fields: {},
                    phone
                }
            };

            // Add UTM parameters to the JSON payload
            const utmParams = {
                utm_source: params.utm_source,
                utm_campaign: params.utm_campaign,
                utm_term: params.utm_term,
                utm_content: params.utm_content
            };

            Object.keys(utmParams).forEach(key => {
                if (utmParams[key]) json.viewer[key] = utmParams[key];
            });

            console.log('Final JSON Payload for WebinarFuel:', JSON.stringify(json));

            try {
                // Send data to WebinarFuel
                const response = await fetch("https://embed.webby.app/embed/v2/viewers", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer Dp2kG9Vucpyq5t5RVPqvDxfU' // Replace with actual API key
                    },
                    body: JSON.stringify(json)
                });

                const result = await response.json();
                if (result.cid) {
                    localStorage.setItem('_wf_cid', result.cid);
                    console.log('CID set in localStorage:', result.cid);
                } else {
                    console.error('No CID returned from server');
                }
            } catch (error) {
                console.error('Error in WebinarFuel AJAX request:', error);
            }
        });
    } else {
        console.error('Form element not found. Please check the form ID.');
    }
});
</script>
