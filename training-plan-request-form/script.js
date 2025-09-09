(function(){
  const form = document.getElementById('requestForm');
  const submitStatus = document.getElementById('submitStatus');

  const startTime = performance.now();

  function showStatus(cls, text){
    submitStatus.style.display = 'block';
    submitStatus.className = 'result ' + cls;
    submitStatus.textContent = text;
    submitStatus.scrollIntoView({behavior:'smooth', block:'center'});
  }

  // Toggle "Other" fields (full-row, always below dropdown)
  function toggleOtherField(selectId, otherInputId){
    const select = document.getElementById(selectId);
    const otherInput = document.getElementById(otherInputId);
    select.addEventListener('change', function(){
      if(this.value === 'Other'){
        otherInput.style.display = 'block';
        otherInput.required = true;
      } else {
        otherInput.style.display = 'none';
        otherInput.required = false;
        otherInput.value = '';
      }
    });
  }
  toggleOtherField('group-type', 'group-type-other');
  toggleOtherField('goals', 'goals-other');
  toggleOtherField('facilitator', 'facilitator-other');

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    if(!form.checkValidity()){
      form.reportValidity && form.reportValidity();
      return;
    }

    document.getElementById('page_url').value = location.href;
    document.getElementById('user_agent').value = navigator.userAgent || '';
    document.getElementById('time_to_submit_ms').value = Math.round(performance.now() - startTime).toString();

    const fd = new FormData(form);

    try{
      const resp = await fetch(form.action, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if(resp.ok){
        showStatus('high', '✅ Thank you! Your request has been received. We’ll send your tailored training plan to your email soon.');
        form.reset();
      } else {
        let msg = '⚠️ Submission failed. Please try again in a moment.';
        try {
          const data = await resp.json();
          if(data && data.errors && data.errors.length){
            msg = data.errors.map(e => e.message).join(' ');
          }
        } catch(_) {}
        showStatus('low', msg);
      }
    } catch(err){
      showStatus('low', '⚠️ Network error. Please check your connection and try again.');
    }
  });
})();
