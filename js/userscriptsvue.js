var coursepage = 1;
    var endofcourses = false;
	var usercookie=[];
	var coursecollection={};
	
    jQuery(document).ready(function () {
		

        var check_usercookie=getCookie("userQueue");
		coursecollection["Playlist"]=[];
		usercookie=JSON.parse('[{"id":"1139","title":"Racecar: Pro Le Mans","image":"https://dev.minigolf.io/wp-content/uploads/2020/07/11391440x1600-1.png"},{"id":"54","title":"The C","image":"https://dev.minigolf.io/wp-content/uploads/2020/05/541440x1600-1.png"},{"id":"897","title":"Smiley","image":"https://dev.minigolf.io/wp-content/uploads/2020/07/8971440x1600.png"},{"id":"57","title":"Tristo","image":"https://dev.minigolf.io/wp-content/uploads/2020/05/571440x1600-1.png"}]');
		coursecollection["Playlist"]=usercookie;
		if(check_usercookie.length > 0){
			 usercookie=JSON.parse(check_usercookie);
			 
			 
			 //console.log(usercookie);
			// cookieobj["Playlist"]=usercookie;
				
				coursecollection["Playlist"]=usercookie;
			//	console.log(coursecollection);
			
	  }
		getmorecourses(coursepage);
		refreshSlider(-1);

    })

    
    function getmorecourses(coursepagenum) {
		var coursetypearr=[];
	//	var courses={};
		var tobeappended="";
		var getcoursetypes=getendpoint("https://dev.minigolf.io/wp-json/wp/v2/coursetype?_fields=id,name");
	getcoursetypes.done(function(data,status){
		jQuery.each(data,function(i,d){
			coursecollection[d.name]=[];
			coursetypearr[d.id]=d.name;
		})

	})
	var getcourses=getendpoint("https://dev.minigolf.io/wp-json/wp/v2/course/?per_page=100");
	getcourses.done(function(data,status){
		jQuery.each(data,function(i,d){
			jQuery.each(d.coursetype,function(k,l){ 
			
				if(coursecollection[coursetypearr[l]].map(function(e){return e.title}).indexOf(d.title.rendered) == -1){
					var newimgobj={};
					newimgobj.id=parseInt(d.id);
					newimgobj.title=d.title.rendered;
					newimgobj.image=d.image.guid;
					coursecollection[coursetypearr[l]].push(newimgobj);

				} 
			})

		})

var vueobj=new Vue({
		el:"#slidercontainer",
			data:{items:coursecollection,usercookie:usercookie.map(function(e){return parseInt(e.id)}),iframeurl:"",isVisible:false,iconflag:false,iconthemer:false,mapitem:{}},
			methods:{
					addorremovequeue:function(data,event){
						console.log(data);
						jQuery('.slickslidercls:first').slick('unslick');
						var checkcourseid=usercookie.map(function(e){return  parseInt(e.id)}).indexOf(parseInt(data.id));
						console.log(checkcourseid);
						if(checkcourseid != -1){
							usercookie.splice(checkcourseid,1);
							this.iconflag=false;
							this.iconthemer=false;
						}else{
							usercookie.unshift(data);
							this.iconthemer=true;	
						}
						
						coursecollection["Playlist"]=usercookie;
						console.log(usercookie);
						this.items = coursecollection;
						this.usercookie = usercookie.map(function(e){return parseInt(e.id)});											
						refreshSlider(0);
						setCookie("userQueue","",0);
						setCookie("userQueue",JSON.stringify(usercookie),1);
					},showpopup:function(item,items,usercookie,index){

						this.iconflag=Object.keys(items).indexOf(index) == 0 ? true : false;
						this.mapitem=item;
						this.iconthemer=(Object.keys(items).indexOf(index) > 0 && this.usercookie.indexOf(item.id) != -1) ? true:false;
						console.log("theme"+this.iconthemer+"icon"+this.iconflag);
						this.iframeurl="https://minigolf.io/3d/?mapurl=https://dev.minigolf.io/wp-json/wp/v2/course/"+item.id;
						//jQuery(".popupMain").show();
						this.isVisible=true;
						
					},closepopup:function(){
							this.iframeurl="";
							this.isVisible=false;
					}

			}
		});
		
 })
	

   

    }
	
function getendpoint(endpointurl) {
      return  jQuery.ajax({
            url: endpointurl,
            dataType: 'json',
            async: false,          
        });

    }
function setCookie(cname, cvalue, exdays) {

  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
 //	console.log(cname + "=" + cvalue + ";" + expires + ";path=/");
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function refreshSlider(mode){
	var cls= jQuery('.slickslidercls');
	if(mode >= 0){
		Vue.nextTick(function () {
			 cls= jQuery('.slickslidercls:first');
		})
	}
	Vue.nextTick(function () {
			  jQuery(cls).slick({		
				  dots: true,
				  infinite: false,
				  speed: 300,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  responsive: [{breakpoint: 1024,settings: {slidesToShow: 3,slidesToScroll: 3,infinite: true,dots: true}},{breakpoint: 980,settings: {slidesToShow: 2,slidesToScroll: 2}},{breakpoint:600,settings: {slidesToShow: 1,slidesToScroll: 1}}]
			 });
		})

		
}
