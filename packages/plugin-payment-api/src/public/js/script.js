document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('modal');
    var modalBtn = document.getElementById('modal-btn');
    var closeBtn = document.getElementById('close-btn');
  
    modalBtn.addEventListener('click', function () {
      modal.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
    });
  });