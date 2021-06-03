import data from './api.js';

(async function getNames(){
  var html = "";
  const names = await data();

  function checkbox(name, id) {
    return  `
    <input class="form-check-input" type="checkbox" id="${id}" name="${name}" >
    <label class="container form-check-label for="${id}"> ${name} </label> 
    `;
  }
  
  view(names);
  function view(names, hidden = false) {
    html += `<ul style='display:${hidden ? 'none' : 'block'}'>`;
    
    Object.values(names).map((elem) => {
      let { name, id} = elem;
      html += `<li> ${checkbox(name, id)}`;
      
      if (elem.children) {
        view(elem.children, true);
      }
      html += "</li>";
    })  
    html += "</ul>";
  }

  document.getElementById("list").innerHTML = html;
  
  function toggleView(item) {
    let { style } = item.parentNode.lastElementChild;
    style.display = style.display === 'none' ? 'block' : 'none'
  }
  
  
  // source: https://css-tricks.com/indeterminate-checkboxes/
  //  helper function to create nodeArrays (not collections)
  const nodeArray = (selector, parent=document) => [].slice.call(parent.querySelectorAll(selector));

  addEventListener('change', e => {
    console.log({ e })
    let check = e.target;

    console.log({ check })
    
    //  check/unchek children (includes check itself)
    const children = nodeArray('input', check.parentNode);
    children.forEach(child => child.checked = check.checked);
    
    //  traverse up from target check
    while(check){
      
      //  find parent and sibling checkboxes (quick'n'dirty)
      const parent   = (check.closest(['ul']).parentNode).querySelector('input');
      const siblings = nodeArray('input', parent.closest('li').querySelector(['ul']));
      console.log({ siblings })
      
      //  get checked state of siblings
      //  are every or some siblings checked (using Boolean as test function) 
      const checkStatus = siblings.map(check => check.checked);
      const every  = checkStatus.every(Boolean);
      const some = checkStatus.some(Boolean);     
      
      //  check parent if all siblings are checked
      //  set indeterminate if not all and not none are checked
      parent.checked = every;     
      parent.indeterminate = !every && every !== some;
      
      //  prepare for nex loop
      check = check != parent ? parent : 0;
    }
  })
  
  addEventListener('click', function(event) {
    console.log('clicked')
    if(event.target.className.indexOf('label') != -1) {
      toggleView(event.target);
    }
    
  })
})()