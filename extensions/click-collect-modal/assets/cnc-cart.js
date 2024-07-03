async function cartUpdate(e){try{let t=await fetch("/cart/update.js",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({updates:e})});if(t.ok){console.log("testings ",t),document.querySelectorAll(".cart-grid p.error-massage.active").forEach(e=>{e.closest(".cart-grid").remove()}),document.querySelector(".remove-allitem").style.display="none";let a=document.querySelector("button.cart-btn.gotocheckout.checkoutbtn");a.disabled=!1,a.classList.remove("disabled");let i=await fetch("/cart.json"),n=await i.json(),o=parseFloat((n.original_total_price/100).toFixed(2)).toLocaleString("en-UA",{style:"currency",currency:n.currency});document.querySelector(".cart-right .sub-total .price .totals__subtotal-value").innerHTML=o}}catch(r){console.error("Error:",r)}}function setCookie(e,t,a){let i="";if(a){let n=new Date;n.setTime(n.getTime()+864e5*a),i="; expires="+n.toUTCString()}document.cookie=e+"="+t+i+"; path=/"}function getCookie(e){let t=document.cookie.split(";").map(e=>e.trim().split("=")),a=t.find(t=>t[0]===e);return a?a[1]:null}async function fetchAccessToken(){try{let e=await fetch(`https://events-announcements-playback-shape.trycloudflare.com/api/get?shop=${location.hostname}`,{headers:{"Content-Type":"application/json",Accept:"application/json"}});if(!e.ok)throw Error("Network response was not ok.");return await e.json()}catch(t){throw console.error("Error fetching access token:",t),t}}async function getCartLocations(e,t=""){try{let a=await fetch("/admin/api/2024-04/locations.json",{headers:{"X-Shopify-Access-Token":e}});if(a.ok){let i=await a.json(),n=i.locations.filter(e=>e.zip).map(e=>`${e.address1} ${e.city} ${e.zip} ${e.province} ${e.country_name}`),o=document.querySelector(".address-popup11 .locationss");if(o.innerHTML="",n.length>0){let r=getCookie("customerlocation");document.querySelector(".location").value=r;let l=`https://events-announcements-playback-shape.trycloudflare.com/api/distance?customerlocation=${r}&destinations=${n.join("|")}&shop=${document.domain}`,s=await fetchData(l),c=i.locations.map((e,t)=>{if("OK"===s.rows[0].elements[t].status){let a=s.rows[0].elements[t].distance.text;return{...e,distance:parseInt(a.replace(/,/g,"").replace(" km","")),distancetext:a}}}).filter(Boolean).sort((e,t)=>e.distance-t.distance);c.forEach(e=>{if(t&&"Snow City Warehouse"!==e.name){let a=document.createElement("div");a.classList.add("radio-btn");let i=document.createElement("div");i.classList.add("col");let n=document.createElement("input");n.type="radio",n.id=e.id,n.classList.add("locations"),n.name="locations",n.dataset.name=e.name,t===e.name&&(n.checked=!0);let r=document.createElement("label");r.htmlFor=e.id,r.textContent=e.name,i.appendChild(n),i.appendChild(r);let l=document.createElement("div");l.classList.add("col2"),l.textContent=e.distancetext,a.appendChild(i),a.appendChild(l),o.appendChild(a)}})}else{let d=document.createElement("div");d.classList.add("popup-inner-col11"),d.innerHTML='<div class="add11">Stores not available for entered location</div>',o.appendChild(d)}document.querySelector(".address-popup11").style.display="block"}}catch(y){console.error("Error getting cart locations:",y)}}async function get_inv_locations(e,t){let a=`query MyQuery {
        product(id: "gid://shopify/Product/${t.product_id}") {
            tags
            title
            tracksInventory
            collections(first: 10) {
                nodes { id title handle }
            }
            variants(first: 10) {
                nodes {
                    inventoryItem {
                        inventoryLevels(first: 10) {
                            edges {
                                node {
                                    location { activatable name }
                                    id
                                    quantities(names: "available") {
                                        name id quantity
                                    }
                                }
                            }
                        }
                        id
                    }
                }
            }
        }
    }`; try{let i=await fetch(`${location.origin}/admin/api/2024-04/graphql.json`,{method:"POST",headers:{"Content-Type":"application/json","X-Shopify-Access-Token":`${e.accessToken}`},body:JSON.stringify({query:a})});if(i.ok){let n=await i.json();handle_inv_locations(null,n.data,t)}else{let o=Error("Request failed");handle_inv_locations(o,null,t)}}catch(r){handle_inv_locations(r,null,t)}}function handle_inv_locations(e,t,a){ console.log('eee ', e ); if(e){console.error("Error fetching inventory locations:",e);return}let i=a.variant_id,n=getCookie("storelocationName");t.product.variants.nodes.forEach(e=>{let t=e.id.split("/"),o=t[t.length-1];if(o==i){let r=!1;e.inventoryItem&&e.inventoryItem.inventoryLevels&&e.inventoryItem.inventoryLevels.edges.forEach(e=>{let t=e.node.location;n===t.name&&"Snow City Warehouse"!==t.name?r=e.node.quantities[0].quantity>2&&e.node.quantities[0].quantity>=a.quantity:t.name||(r=!0)}),document.querySelectorAll(".cart-grid").forEach(e=>{if(e.dataset.id==i){let t=e.querySelector(".error-massage");r?(t.style.display="none",t.classList.remove("active")):(e.querySelector(".error-massage .locationsname").textContent=n,t.style.display="block",t.classList.add("active"))}})}});let o=document.querySelectorAll(".cart-grid p.error-massage.active").length>0,r=document.querySelector(".remove-allitem"),l=document.querySelector("button.cart-btn.gotocheckout.checkoutbtn");r.style.display=o?"flex":"none",l.disabled=o,l.classList.toggle("disabled",o)}async function fetch_inventory_for_cart_items(e,t){let a=document.querySelectorAll(".cart-grid");a.forEach(a=>{let i=a.dataset.id,n=t.find(e=>e.variant_id==i);if(n){let o=a.querySelector(".item-quantities span b");o&&(o.textContent=n.quantity),a.classList.add("matched"),get_inv_locations(e,n)}else a.style.display="none"}),document.querySelectorAll(".cart-grid:not(.matched)").forEach(e=>{e.style.display="none"})}async function init(){let e=await fetchAccessToken(),t=await fetch("/cart.js");if(t.ok){let a=await t.json();fetch_inventory_for_cart_items(e,a.items)}}init();