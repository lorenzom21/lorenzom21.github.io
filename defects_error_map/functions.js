function start(){


	
	selected_layer="layerA";
	
	$("#layer_accuracy").empty();
	day_range=0;
	
	oldest_day=99999;
	newest_day=3;
	
	
	if(oldest_day > newest_day){
	
		
		if(newest_day < 2){
			alert("Cannot include data younger than 2 days.");
		}
		else{
			day_range=1;
		}
		
	}
	else{
		alert("Invalid day range.");
	}
	
	

	if(day_range==1){
		$("#svg_canvas").empty();
		online=$('#body').attr("online");
		raw_data=get_raw_data();

		
		//selected_layer=$("#layer_select").val();
		
		selected_layer="layerA";
		class_codes_array=get_class_codes();
		
		defect_array=summarize_data(raw_data);
		
		subset_data(selected_layer,defect_array, class_codes_array);
	}

	
}


function summarize_data(defect_data){
	
	var defect_array= new Array();
	
	defect_data.forEach(function(defect){
		
		
			current_layer=defect.LAYER_STEP_ID;
			from_class=defect.CLASS_NUMBER;
			to_class=defect.FINAL_CLASS;
			inspection_date=defect.INSPECTION_DATE;
			
			if(to_class!=""){
			
				
				
				current_time=new Date();
				
				//Date.parse parses a date string and returns the number of milliseconds since midnight of January 1, 1970.
				
				ms_in_day=24*60*60*1000;
				
				this_date=Date.parse(inspection_date)/ms_in_day;
				days_passed=(Date.parse(current_time)-Date.parse(inspection_date))/ms_in_day;
				
				oldest_day=parseInt($("#oldest_day").val());
				newest_day=parseInt($("#newest_day").val());
				
			
				
				if(typeof defect_array[current_layer] == 'undefined'){
				
					defect_array[current_layer]= new Array();
				}
				
				if(typeof defect_array[current_layer][from_class] == 'undefined'){
				
					defect_array[current_layer][from_class] = new Array();
					defect_array[current_layer][from_class]["destinations"]= new Array();
					defect_array[current_layer][from_class]["count"] = 0;
					defect_array[current_layer][from_class]["code"] = from_class;
			
				}
				
				if(typeof defect_array[current_layer][from_class]["destinations"][to_class] == 'undefined'){
					
					defect_array[current_layer][from_class]["destinations"][to_class] = new Array();
					defect_array[current_layer][from_class]["destinations"][to_class]['count'] = 0;
					defect_array[current_layer][from_class]["destinations"][to_class]['code'] = to_class;
					
				}
				
				defect_array[current_layer][from_class]["count"]++;
				defect_array[current_layer][from_class]["destinations"][to_class]['count']++;
					
				
			}
				
			
	});

	return defect_array;
}



function subset_data(selected_layer,defect_array,class_codes_array){

	//selected_class is no longer an argument. Please update. 
	var subset_array=new Array();
	total_layer_defects=0;
	total_correct_layer_defects=0;
	total_mistakes_this_layer=0;
	
	i=0;
	
	//pre loop to get total and incorrect defects this layer.
	
	
	if(typeof defect_array[selected_layer]!= 'undefined'){
	
	
	
		defect_array[selected_layer].forEach(function(defect){
		
		
		
			current_defect_count=defect["count"];
			current_from_class=defect["code"];
			
			defect["destinations"].forEach(function(element){

				if(current_from_class!=element['code']){
				
					
					total_mistakes_this_layer=total_mistakes_this_layer+element['count'];
					
				}
				
				else{
					
					total_correct_layer_defects=total_correct_layer_defects+element['count'];
				}
			
			});

		});
	
		defect_array[selected_layer].forEach(function(defect){
		

			current_defect_count=defect["count"];
			current_from_class=defect["code"];
			
			total_layer_defects=total_layer_defects+current_defect_count;
			
			defect["destinations"].forEach(function(element){

				

				if(current_from_class!=element['code']){
				
					i++;
					//fraction_to=element['count']/current_defect_count;
					fraction_to=element['count']/total_mistakes_this_layer;
					
				
					subset_array[i]= new Array();
					
					subset_array[i]['to']=fraction_to;
					subset_array[i]['class_number']=current_from_class;
					subset_array[i]['class_name']=class_codes_array[current_from_class];
					subset_array[i]['to_class_number']=element['code'];
					subset_array[i]['to_class_name']=class_codes_array[element['code']];
					subset_array[i]['to_count']=element['count'];
					
					
				}
				
			
			});

		});
		
	}
	
	
	if(total_layer_defects!=0){
			layer_accuracy=Math.round(total_correct_layer_defects/total_layer_defects*100*100)/100;
			layer_accuracy=layer_accuracy+"%";
	}
	else{
			layer_accuracy="no defects this layer";
	}
	$("#layer_accuracy").empty();
	$("#layer_accuracy").append(layer_accuracy);
	

	
	print(subset_array);
	

}


function compare(a,b) {


	if (a.to < b.to){
		return 1;
	}
	else if (a.to > b.to){
		return -1;
	}
	else{
		return 0;
	}
	

}

function print(subset_array){

	$("#svg_canvas").empty();
	//selected_class is no longer an argument. Please update. 

	width=600;
	var left_x=340;
	var right_x=left_x+width;
	var top_y=20;
	var v_scale=30;
	var arrow_adjust=4;
	
	var parsed_subset= new Array();
	
	subset_array.forEach(function(element){
		parsed_subset.push(element);
	});
	
	

	
	parsed_subset.sort(compare);
	
	var svg=d3.select("#svg_canvas");
	var selection=svg.selectAll("g").data(parsed_subset)

		
	selection
		.enter().append("g")
			.attr("class", function(d){return "g_final_class_"+d.to_class_number+" "+"g_from_class_"+d.class_number+" defect_pair";})
			.append("line")
				.attr("stroke", "steelblue")  //blue lines
				.attr("stroke-width", 10)
				.attr("marker-end", "url(#to_arrow)")
				.on("mouseover", function(d,i){$("#right_label_"+i).attr("fill","#ab0e4c"); $("#left_label_"+i).attr("fill","#ab0e4c");})
				.on("mouseout", function(d,i){$("#right_label_"+i).attr("fill","black"); $("#left_label_"+i).attr("fill","black");})
				.attr("y1", function(d,i){ return (i+1)*v_scale+top_y+arrow_adjust})
				.attr("y2", function(d,i){ return (i+1)*v_scale+top_y+arrow_adjust})
				.attr("x1", left_x)
				.attr("x2", function(d,i){ return left_x+d.to*(width-18);});   //make allowance for arrow
				
	selection //right label
			.append("text")
				.attr("id", function(d,i){return "right_label_"+i})
				.on("mouseover", function(d,i){$("#right_label_"+i).attr("fill","#ab0e4c"); $("#left_label_"+i).attr("fill","#ab0e4c"); $(".defect_pair").css('opacity',0.25); $(".g_final_class_"+d.to_class_number).css('opacity',1);   })
				.on("mouseout", function(d,i){$("#right_label_"+i).attr("fill","black"); $("#left_label_"+i).attr("fill","black"); $(".defect_pair").css('opacity',1); })
				.attr("x", function(d,i){ return left_x+20+d.to*(width-18);}) //display count slightly to right of arrow
				.attr("y", function(d,i){ return (i+1)*v_scale+top_y+arrow_adjust+5})
				.attr("fill", "black")
				.html(function(d){ if(d.to_count==1){countsss="count"} else {countsss="counts";}; return "<tspan fill='steelblue'>"+d.to_count+" "+countsss+" to </tspan> class "+d.to_class_number+" "+", "+Math.round(d.to*100)+"%" ;})
		
	
	selection	//left label
		.append("text")
			.attr("text-anchor", "end")
			.attr("x", left_x-5)
			.attr("y", function(d,i){ return (i+1)*v_scale+top_y+v_scale/4})
			.attr("id", function(d,i){return "left_label_"+i})
			.on("mouseover", function(d,i){$("#left_label_"+i).attr("fill","#ab0e4c"); $("#right_label_"+i).attr("fill","#ab0e4c"); $(".defect_pair").css('opacity',0.25); $(".g_from_class_"+d.class_number).css('opacity',1);})
			.on("mouseout", function(d,i){$("#left_label_"+i).attr("fill","black") ;$("#right_label_"+i).attr("fill","black"); $(".defect_pair").css('opacity',1); })
			.append("a")
				.attr("xlink:href",function(d,i){;})
				.attr("target", "_blank")
				.text(function(d){return "class "+d.class_number;})
	
	

	selection.exit()
		.remove()
	
	
	
}



function modes_for_this_layer(raw_data){
	

	selected_layer=$("#memory_div").attr("selected_layer");

	var modes_array= new Array();
	raw_data.forEach(function(element){
			//LAYER_STEP_ID, DORCLASS, CLASS_NUMBER
			
			
			if(element.LAYER_STEP_ID==selected_layer & typeof modes_array[element.DORCLASS]=='undefined'){
				modes_array[element.DORCLASS]=element.DORCLASS;	
			}
			if(element.LAYER_STEP_ID==selected_layer & typeof modes_array[element.CLASS_NUMBER]=='undefined'){
				modes_array[element.CLASS_NUMBER]=element.CLASS_NUMBER;	
			}
	})

	return modes_array;


}

function select_shift(){

	selected_shift=$("#shift_select").val();
	$("#memory_div").attr("selected_shift", selected_shift);
	selected_mode=$("#defect_select").val();
	if(selected_mode!='blank'){select_defect_mode();};


}





function select_priority(){


	$("#memory_div").attr("sort",$("#priority_select").val());
	select_defect_mode();
	

}









