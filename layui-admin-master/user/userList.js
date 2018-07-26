/**
 * 用户管理
 */
var pageCurr;
$(function() {
    layui.use(['layer','table','element'], function(){
        var table = layui.table
            ,form = layui.form;
        tableIns=table.render({
            elem: '#uesrList'
            ,url:'data.json'
            ,cellMinWidth: 80
            ,id: 'idTest'
            ,page: true,
            request: {
                pageName: 'page' //页码的参数名称，默认：page
                ,limitName: 'limit' //每页数据量的参数名，默认：limit
            },response:{
//                statusName: 'code' //数据状态的字段名称，默认：code
//                ,statusCode: 200 //成功的状态码，默认：0
//                ,countName: 'totals' //数据总数的字段名称，默认：count
//                ,dataName: 'list' //数据列表的字段名称，默认：data
            }
            ,cols: [[
                {type:'checkbox', fixed: 'left'}
                ,{field:'id', width:80, sort: true, fixed: true , title: 'id'}
                ,{field:'username', width:80 , title: '用户名'}
                ,{field:'sex', width:80, sort: true , title: '性别'}
                ,{field:'city', width:80 , title: '城市'}
                ,{field:'sign', width:160 , title: '签名'}
                ,{field:'experience', width:80, sort: true , title: '积分'}
                
                ,{field:'classify', width:135 , title: '职业'}
                ,{field:'wealth', width:135, sort: true , title: '财富'}
                ,{fixed:'right', title:'操作',align:'center', toolbar:'#optBar'}
            ]]
            ,  done: function(res, curr, count){
                //如果是异步请求数据方式，res即为你接口返回的信息。
                //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
                //console.log(res);
                //得到当前页码
                //console.log(curr);
                //得到数据总量
                //console.log(count);
                pageCurr=curr;
            }
        });
        
  	  //监听表格复选框选择
  	  table.on('checkbox(demo)', function(obj){
  	    console.log(obj)
  	  });
  	  
  	  //监听工具条
  	  table.on('tool(demo)', function(obj){
  	    var data = obj.data;
  	    if(obj.event === 'detail'){
  	      layer.msg('ID：'+ data.id + ' 的发卡操作');
  	    } else if(obj.event === 'del'){
  	      layer.confirm('真的删除行么', function(index){
  	        obj.del();
  	        layer.close(index);
  	      });
  	    } else if(obj.event === 'edit'){
  	      layer.alert('审核行：<br>'+ JSON.stringify(data))
  	    }
  	  });  
  	  
	  var $ = layui.$, active = {
	    getCheckData: function(){ //获取选中数据
	      var checkStatus = table.checkStatus('idTest')
	      ,data = checkStatus.data;
	      layer.alert(JSON.stringify(data));
	    }
	    ,getCheckLength: function(){ //获取选中数目
	      var checkStatus = table.checkStatus('idTest')
	      ,data = checkStatus.data;
	      layer.msg('选中了：'+ data.length + ' 个');
	    }
	    ,isAll: function(){ //验证是否全选
	      var checkStatus = table.checkStatus('idTest');
	      layer.msg(checkStatus.isAll ? '全选': '未全选')
	    }
	  };
	  
		//功能按钮
	    var active={
			addUser : function(){
	            var addIndex = layer.open({
	                title : "新增数据表",
	                type : 2,
	                content : "addclassmate.html",
	                success : function(layero, addIndex){
	                    setTimeout(function(){
	                        layer.tips('点击此处返回会员列表', '.layui-layer-setwin .layui-layer-close', {
	                            tips: 3
	                        });
	                    },500);
	                }
	            });
	            //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
	            $(window).resize(function(){
	                layer.full(addIndex);
	            });
	            layer.full(addIndex);
	      }};
            
	  $('.layui-btn').on('click', function(){
	    var type = $(this).data('type');
	    active[type] ? active[type].call(this) : '';
      });
    });
    //搜索框
    layui.use(['form','laydate'], function(){
        var form = layui.form ,layer = layui.layer
            ,laydate = layui.laydate;
        //日期
        laydate.render({
            elem: '#insertTimeStart'
        });
        laydate.render({
            elem: '#insertTimeEnd'
        });
        //TODO 数据校验
        //监听搜索框
        form.on('submit(searchSubmit)', function(data){
            //重新加载table
            load(data);
            return false;
        });
    });
    layui.use(['element', 'layer'], function(){
  	  var element = layui.element;
  	  var layer = layui.layer;

  	  //监听折叠
  	element.on('collapse(test)', function(data){
  	    layer.msg('展开状态：'+ data.show);
  	  });
  	});
    
});



//提交表单
function formSubmit(obj){
    var currentUser=$("#currentUser").html();
    if(checkRole()){
        if($("#id").val()==currentUser){
            layer.confirm('更新自己的信息后，需要您重新登录才能生效；您确定要更新么？', {
                btn: ['返回','确认'] //按钮
            },function(){
                layer.closeAll();
            },function() {
                layer.closeAll();//关闭所有弹框
                submitAjax(obj,currentUser);
            });
        }else{
            submitAjax(obj,currentUser);
        }
    }
}
function submitAjax(obj,currentUser){
    $.ajax({
        type: "POST",
        data: $("#userForm").serialize(),
        url: "/user/setUser",
        success: function (data) {
            if(isLogin(data)){
                if (data == "ok") {
                    layer.alert("操作成功",function(){
                        if($("#id").val()==currentUser){
                            //如果是自己，直接重新登录
                            parent.location.reload();
                        }else{
                            layer.closeAll();
                            cleanUser();
                            //$("#id").val("");
                            //加载页面
                            load(obj);
                        }
                    });
                } else {
                    layer.alert(data,function(){
                        layer.closeAll();
                        //加载load方法
                        load(obj);//自定义
                    });
                }
            }
        },
        error: function () {
            layer.alert("操作请求错误，请您稍后再试",function(){
                layer.closeAll();
                //加载load方法
                load(obj);//自定义
            });
        }
    });
}


