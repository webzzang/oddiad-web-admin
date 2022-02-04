// custom 셀렉트박스 생성(함수)
function fn_customSelect(){
	$(".customSelect").each(function(){
		var target = $(this).attr("id");
		var targetClass = $(this).attr("class");
		var selected = $(this).find("option:selected").index();
		var selectedTxt = $(this).find("option:selected").text();
		var add = '';
		add += "<div class='slt_custom' data-id='" + target + "'>";
		add += "<a href='#none' class='btn_slt'>Select</a>";
		add += "<div><ul></ul></div>";
		add += "</div>";

		$(this).after(add);
		$("[data-id='" + target + "']").addClass(targetClass);
		
		var option = $(this).find("option");
		var ul = $("[data-id='" + target + "']").find("ul");
		for ( i = 0; i < option.length; i++ ){
			ul.append("<li><a href='#none' select-id='" + target + "'>" + option.eq(i).text() + "</a></li>");
		}
		ul.find("> li").eq(selected).addClass("selected").parents(".slt_custom").find(".btn_slt").text(selectedTxt);
	});
}

function sltOnInit(){
	$(".slt_custom a").unbind("click");
	$(document).on("click", ".slt_custom a", sltOn);
}

function sltOffInit(){
	//$(document).unbind("click");
	$(document).on("click", sltOff);
}

function sltFocusOutInit(){
	$(".slt_custom li > a").unbind("keydown");
	$(document).on("keydown", ".slt_custom li > a", sltFocusOut);
}

function sltFocus(){
	$("label").unbind("click");
	$(document).on("click", "label", sltFocus);
}

// custom 셀렉트박스 여는경우
function sltOn(){
	var slt = $(this).parent(".slt_custom");
	var target = "#" + $(this).parents(".slt_custom").attr("data-id");
	$(this).parents(".slt_custom").toggleClass("on");

	if ( $(this).parent()[0].tagName == "LI" ){
		var txt = $(this).text();
		var index = $(this).parent().index();
		var selectId = $(this).attr("select-id");
		
		$(target).find("option").eq(index).attr("selected", "selected").siblings().removeAttr("selected");
		$(this).parent().addClass("selected").siblings().removeClass("selected");
		$(this).parents(".slt_custom").removeClass("on").find("> a").text(txt);
		$("#"+selectId).change();
	}
	else {
		$(".slt_custom").not(slt).removeClass("on");
		$(this).siblings().scrollTop(0);
	};
};

// custom 셀렉트박스 닫는경우
function sltOff(e){
	var target = e.target;
	var targetId = target.id;
	var targetClass = target.className;

	if ( targetClass != "btn_slt" ){
		$(".slt_custom").removeClass("on");
	};
};

// custom 셀렉트박스 focus out
function sltFocusOut(e){
	var index = $(this).parent("li").index();
	var last = $(this).parents("ul").find("li").length - 1;
	var key = event.keyCode || event.which; 

	if ( index == last ){
		console.log("last");
		if ( e.shiftKey ){ 
			if ( key == 9 ){
				console.log("shift+back");
			}
		}
		else {
			$(this).parents(".slt_custom").removeClass("on");
			$(this).parents("div").scrollTop(0);
			console.log("닫힘");
		};
	}
};

// custom 셀렉트박스 label 연동
function sltFocus(){
	var target = $(this).attr("for");
	$("[data-id='" + target + "']").find("> a").focus();
};



$(document).ready(function(){

	// custom 셀렉트박스 생성
	$("select").each(function(){
		var target = $(this).attr("id");
		var targetClass = $(this).attr("class");
		var selected = $(this).find("option:selected").index();
		var selectedTxt = $(this).find("option:selected").text();
		var add = '';
		add += "<div class='slt_custom' data-id='" + target + "'>";
		add += "<a href='#none' class='btn_slt'>Select</a>";
		add += "<div><ul></ul></div>";
		add += "</div>";

		$(this).after(add);
		$("[data-id='" + target + "']").addClass(targetClass);
		
		var option = $(this).find("option");
		var ul = $("[data-id='" + target + "']").find("ul");
		for ( i = 0; i < option.length; i++ ){
			ul.append("<li><a href='#none' select-id='" + target + "'>" + option.eq(i).text() + "</a></li>");
		}
		ul.find("> li").eq(selected).addClass("selected").parents(".slt_custom").find(".btn_slt").text(selectedTxt);
	});

	//custom 셀렉트박스관련 함수 호출
	sltOffInit();
	sltOnInit();
	sltFocusOutInit();
	sltFocus();
	//

	// gnb bar
	function gnbBar(){
		var leng = $("#gnb > ul > li").length;
		$("#gnb").append("<div class='g_bar' style='position: absolute; bottom: 0; opacity: 0; text-align: center;'><span style='display: inline-block; padding: 0 10px; height: 3px; background: #214c9c; vertical-align: top;'>&nbsp;</span></div>");
		$(document).on("mouseenter", "#gnb > ul > li > a", function(){
			var index = $(this).parent().index();
			var gnbWidth = $("#gnb").width();
			var liWidth = $("#gnb > ul > li").width();
			var move = index * liWidth;
			var barWidth = $(this).find("span").outerWidth();
			$(".g_bar").width(gnbWidth / leng);
			if ( $("#gnb").is(".on") != true ){
				$(".g_bar").css({
					"left": move
				});
				$("#gnb").addClass("on");
			};
			$(".g_bar").stop().animate({
				"opacity": 1,
				"left": move
			}, 170);
			$(".g_bar span").stop().animate({
				"width": barWidth
			}, 170);
		});
		$(document).on("mouseleave", "#gnb", function(){
			$(this).removeClass("on");
		});
		$(document).on("mouseleave", "#gnb > ul > li > a", function(){
			$(".g_bar").stop().animate({
				"opacity": 0
			}, 170);
			$(".g_bar span").stop().animate({
				"width": 0
			}, 170);
		});
	};
	$(window).load(function(){
		gnbBar();
	});

	// header > 환경설정 > 화면잠금 "해제"
	function optionLock(){
		$(this).toggleClass("on");
		if ( $(this).is(".on") ){
			$(this).text("화면잠금해제");
		}
		else {
			$(this).text("화면잠금");
		};
	};
	$(document).on("click", ".btn_screen_option_lock", optionLock);

	// lnb
	function lnb(){
		var leftIn = $("#lnb").outerWidth();
		var leftOut = $(".lnb .in_wrap").outerWidth();
		var winWidth = $(window).width();

		$(window).load(function(){
			$("#lnb .depth > li").each(function(){
				if ( $(this).is(".on") ){
					$(this).find(".depth02").show();
				}
			});
		});

		function lnbListOn(){
			if ( $("#lnb").is(".on") == false ){
				$("#lnb").addClass("on");
			}
			$(this).parent().addClass("on").siblings().removeClass("on");
		};
		$(document).on("click", ".lnb > li > a", lnbListOn);

		function lnbOn(){
			if ( $("#lnb").is(".on") == false ){
				$(".lnb_menu > a").trigger("click");
			}
			else {
				if ( $("body").is(".lnb_fixed") == false ){
					$("#lnb").removeClass("on");
				}
			};
		};
		$(document).on("click", ".btn_lnb", lnbOn);

		function lnbDepthOn(){
			$(this).next(".depth02").stop().slideDown(200).parent().addClass("on").siblings().removeClass("on").find(".depth02").stop().slideUp(200);
		};
		$(document).on("click", ".lnb .depth > li > a", lnbDepthOn);

		function lnbFixed(){
			if ( $(this).is(".clear") == false ){
				$(this).addClass("clear").text("LNB 고정 해제");
				$("body").addClass("lnb_fixed");
				$(".lnb_menu > a").trigger("click");
			}
			else {
				$(this).removeClass("clear").text("LNB 고정");
				$("body").removeClass("lnb_fixed");
				$(".btn_lnb").trigger("click");
			};
		};
		$(document).on("click", ".btn_lnb_fixed", lnbFixed);
	};
	lnb();

	// 검색화면 통 스크롤
	function searchResize(){
		$("html, body").css({"height": "auto"});
		$("html").css({"overflow-x": "hidden", "overflow-y": "auto"});
		if ( $(window).width() > 1262 ){
			$("html, body").css({"min-width": "0", "overflow-x": "hidden"});
		}
		else {
			$("html, body").css({"min-width": "1280px", "overflow-x": "auto"});
		};
	};
	if ( $("body").is(".search") ){
		searchResize();
		$(window).resize(function(){
			searchResize();
		});
	};

	// btn_top
	function btnTopScroll(){
		$(window).scroll(function(){
			var docHeight = $(document).height();
			var winHeight = $(window).height();
			var hdHeight = $("#header").height();
			var scrTop = $(window).scrollTop();
			var scrEnd = docHeight - (winHeight + scrTop);

			if ( scrTop > hdHeight ){
				$(".btn_top").addClass("on");
			}
			else {
				$(".btn_top").removeClass("on");
			};
		});

		function upScroll(e){
			e.preventDefault();
			var target = $(this).attr("href");
			var targetTop = $(target).offset().top;
			$("html, body").animate({ "scrollTop": targetTop }, 300);
		};
		$(document).on("click", ".btn_top", upScroll);
	};
	btnTopScroll();

	// tab
	function tabOn(e){
		e.preventDefault();
		var target = $(this).attr("href");
		$(this).parent().addClass("on").siblings().removeClass("on");
		if ( target != "#" && target != "#none" && target != "" ){
			$(target).addClass("on").siblings().removeClass("on");
		}
	};
	$(document).on("click", ".tabOn > li > a", tabOn);

	// 파일 찾기
	function addFile(){
		var fileVal = $(this).val();
		$(this).parents(".add_file").find('p').find('.txt').hide();
		$(this).parents(".add_file").find('p').find('.file_path').text(fileVal);
		if ( fileVal == '' ){
			$(this).parents(".add_file").find('p').find('.txt').show();
		}
	};
	$(document).on("change", ".add_file input[type='file']", addFile);

	// 글자수 제한
	function txtCheck(){
		var target = $(this).attr("data-target");
		var txtMax = parseInt($(target).find(".txt_max").text());
		var txtVal = $(this).val();
		var txtLength = txtVal.length;
		$(target).find(".txt_length").text(txtLength);
		if ( txtLength > txtMax ){
			$(target).addClass("warning");
			$(this).val(txtVal.substring(0,txtMax));
		}
		else {
			$(target).removeClass("warning");
		}
	};
	$(document).on("keyup", ".limit_number_characters", txtCheck);
	$(".limit_number_characters").each(txtCheck);

	// check시 입력필드로 focus이동, txtarea focus시 check
	function chkInputFocus(){
		var target = $(this).attr("data-target");
		if ( $(this).attr("type") == "checkbox" ){
			if ( $(this).is(":checked") ){
				$(target).focus();
			}
			else {
				$(this).prop("checked", false);
				$(target).focusout();
			};
		}
		else {
			$(target).focus();
		};
	};
	$(document).on("click", ".chk_input_focus", chkInputFocus);
	function txtInputFocus(){
		var target = $(this).attr("data-target");
		$(target).prop("checked", true);
	};
	$(document).on("focus", ".txt_input_focus", txtInputFocus);

	// data-target On
	function targetOn(){
		var target = $(this).attr("data-target");
		$(target).toggleClass("on");
	};
	$(document).on("click", ".targetOn", targetOn);

	// data-target On add
	function targetOnAdd(){
		var target = $(this).attr("data-target");
		$(target).addClass("on");
	};
	$(document).on("click", ".targetOnAdd", targetOnAdd);

	// data-target On add remove
	function targetOnRemove(){
		var target = $(this).attr("data-target");
		$(target).removeClass("on");
	};
	$(document).on("click", ".targetOnRemove", targetOnRemove);

	/* FAQ list */
	function accordionList(){
		$(this).closest("li").toggleClass("on").siblings().removeClass("on");
		$(this).parent().next("dd").stop().slideToggle(225).closest("li").siblings().find("dd").stop().slideUp(225);
	};
	$(document).on("click", ".faq_list dt > a", accordionList);

	// popup z-index
	function popZ(){
		$(".popup").each(function(index){
			var popZindex = 1000 + index;
			if ( $(this).is(".on") && $(this).find("button, a").is(".btn_pop_open") ){
				$(this).css("z-index", 998);
			}
			else {
				$(this).css("z-index", popZindex);
			};
		});
	};
	popZ();

	// popup 열기
	function popOn(){
		$(".dim").stop().fadeIn(100);
		var href = $(this).attr("data-href");
		$(href).stop().fadeIn(300).addClass("on");
		if ( $(this).parents("div").is(".popup") ){
			$(this).parents(".popup").attr("data-open-popup-id", href);
			var target = $(this).parents(".popup").attr("data-open-popup-id");
			var zIndex = $(target).css("z-index");
			$(".dim").css("z-index", zIndex);
		}
	};
	$(document).on("click", ".btn_pop_open", popOn);

	// popup 닫기
	function popOff(){
		var popId = $(this).parents(".popup").attr("id");
		var prevPopId = $(".popup[data-open-popup-id='" + "#" + popId + "']");
		var prevPopAttr = prevPopId.attr("data-open-popup-id");
		$(this).parents(".popup").stop().fadeOut(100).removeClass("on");
		$(this).parents(".popup").removeAttr("data-open-popup-id");
		$(".popup").each(function(index){
			var popZindex = 1000 + index;
			if ( $(this).is(".on") && $(this).attr("data-open-popup-id") != prevPopAttr ){
				$(this).css("z-index", 998);
			}
			else {
				$(this).css("z-index", popZindex);
				$(".dim").css("z-index", 999);
			};
		});
		if ( $(".popup.on").length < 1 ){
			$(".dim").stop().fadeOut(100);
		};
	};
	$(document).on("click", ".btn_pop_close, .btn_pop_cancel", popOff);

	// popup esc 버튼 닫기
	function escClose(e){
		if ( e.keyCode == 27 ){ 
			$(".btn_pop_close, .btn_pop_cancel").trigger("click");
		};
	};
	$(document).on("keydown", escClose);

	// popup 전부 닫기
	function popAllOff(){
		$(".btn_pop_close, .btn_pop_cancel").trigger("click");
	};
	$(document).on("click", ".btn_pop_esc", popAllOff);

});