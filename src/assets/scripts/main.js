

$(function() {
  var delay = 300;
  $(".progress-bar").each(function(i) {
    $(this).delay(delay * i).animate({
      width: $(this).attr('aria-valuenow') + '%'
    }, delay);
  });

  $(function() {
    $('.dropdown-toggle').dropdown();
  });
});


// select 변경
$(function() {
  var aSelect = $('ul.nav-sub > li, li.nav-li > a');
  aSelect.click(function() {
    aSelect.removeClass('active');
    $(this).addClass('active');
  });
});

// datepicker
$(function() {
  $(".datepicker").each(function() {
    $(this).datepicker({
      dateFormat: 'yy.mm.dd' //Input Display Format 변경
        ,
      showOtherMonths: true //빈 공간에 현재월의 앞뒤월의 날짜를 표시
        ,
      showMonthAfterYear: true //년도 먼저 나오고, 뒤에 월 표시
        ,
      yearSuffix: "." //달력의 년도 부분 뒤에 붙는 텍스트
        ,
      monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] //달력의 월 부분 Tooltip 텍스트
        ,
      dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] //달력의 요일 부분 텍스트
        ,
      buttonImageOnly: true //기본 버튼의 회색 부분을 없애고, 이미지만 보이게 함
    });
    $(this).datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후, -1M:한달후, -1Y:일년후)
  });
});
