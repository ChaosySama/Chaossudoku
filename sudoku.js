Vue.component('cell',{
	props:['row','column','origincell'],
	data:function(){
  	return {
    	r:this.row-1,
      c:this.column-1,
      inputnum:''
    }
  },
  methods:{
    valid:function(r,c){
    	var num=this.inputnum
      if(num.length==1 && /^[\D|0]$/.test(num)){
      	this.inputnum=''
        return false
      }
      if(num.length>1){
      	this.inputnum=num.slice(0,-1)
        return false
      }
      if(num.length==0){
      	num=0
      }
      this.$emit('modify',r,c,parseInt(num))
      return true
    },
    check:function(){
    	var r=parseInt(this.r)
      var c=parseInt(this.c)
    	if(this.valid(r,c)) {
      	this.$emit('check',r,c)
      }
    },
    focus:function(){
    	var cellid=(this.r+1)*10+(this.c+1)
      var inputel=document.getElementById(cellid).children[0]
      inputel.select()
    }
  },
  computed:{
  	sudoclass:function(){
    	var top=left=right=bottom='0.1px'
    	if(this.r%3==0){top='2px'}
      if(this.c%3==0){left='2px'}
      if(this.r==8){bottom='3px'}
      if(this.c==8){right='3px'}
    	return {
        'border-top-width': top,
        'border-left-width': left,
        'border-right-width': right,
        'border-bottom-width': bottom
      }
    }
  },
	template:'\
  	<div \
    class="sudo" \
    :style="sudoclass"> \
    <input readonly \
    v-if="origincell!=0" \
    :value="origincell"> \
    <input v-else \
    v-model="inputnum" \
    @input="check" \
    @focus="focus"> \
    </div>'
})

var getorigin=function(){
	var random=Math.floor(Math.random()*2)
	return random==0?[
        [2,3,1,9,8,7,4,6,5],
        [5,7,9,2,6,4,8,1,3],
        [4,8,6,5,3,1,2,9,7],
        [3,6,8,4,9,2,7,5,1],
        [9,5,7,3,1,8,6,4,2],
        [1,2,4,7,5,6,3,8,9],
        [6,1,5,8,2,3,9,7,4],
        [8,4,3,1,7,9,5,2,6],
        [7,9,2,6,4,5,1,0,0]
    ]:[
        [2,3,1,9,8,7,4,6,5],
        [5,7,9,2,6,4,8,1,3],
        [4,8,6,5,3,1,2,9,7],
        [3,6,8,4,9,2,7,5,1],
        [9,5,7,3,1,8,6,4,2],
        [1,2,4,7,5,6,3,8,9],
        [6,1,5,8,2,3,9,7,4],
        [8,4,3,1,7,9,5,2,6],
        [7,9,2,6,4,5,0,0,8]
    ]
}

var vm=new Vue({
	el:'#app',
  data:{
  	origin:getorigin()
  },
  methods:{
  	modify:function(r,c,val){
      this.origin[r][c]=val
    },
    checkrow:function(r,c,val){
    	for(var i=0;i<9;i++){
      	if(this.origin[r][i]!=0 && i!=c && val==this.origin[r][i]){
          return true
        }
      }
      return false
    },
    checkcolumn:function(r,c,val){
    	for(var i=0;i<9;i++){
      	if(this.origin[i][c]!=0 && i!=r && val==this.origin[i][c]){
          return true
        }
      }
      return false
    },
    checksudo:function(r,c,val){
      var bX = Math.floor( r / 3 )
      var bXL = bX * 3
      var bXR = bX * 3 + 2
      var bY = Math.floor( c / 3 )
      var bYL = bY * 3
      var bYR = bY * 3 + 2
      var x, y
      for (x = bXL; x <= bXR; x++) {
        for (y = bYL; y <= bYR; y++) {
        	if(x==r && y==c) continue
        	if(this.origin[x][y]!=0 && val==this.origin[x][y]){
          	return true
        	}
        }
      }
      return false
    },
    checkfinish:function(){
    	for (var r=0; r<9; r++){
      	for (var c=0; c<9; c++){
        	var val=this.origin[r][c]
          if(val==0) return false
          var cellid=(r+1)*10+(c+1)
      		var inputel=document.getElementById(cellid).children[0]
          if(inputel.style.color=='red'){
          	if(this.checkrow(r,c,val) || this.checkcolumn(r,c,val) || this.checksudo(r,c,val)) {
              return false
            }else {
              inputel.style='color:blue'
            }
          }
        }
      }
      return true
    },
    finish:function(){
    	var newgame=confirm('conguatulations! Want a new game?')
      if(newgame){
      	this.origin=getorigin()
        for (let r=0; r<9; r++){
            for (let c=0; c<9; c++){
              let cellid=(r+1)*10+(c+1)
              let inputel=document.getElementById(cellid).children[0]
              if(this.origin[r][c]==0){
                inputel.value=''
              }
              if(inputel.style.color=='blue'){
              	inputel.removeAttribute('style')
                inputel.value=''
              }
            }
          }
      }
    },
    check:function(r,c){
    	var val=this.origin[r][c]
      var cellid=(r+1)*10+(c+1)
      var inputel=document.getElementById(cellid).children[0]
      if(val==0) {
      	inputel.style='color:blue'
        return
      }
      if(this.checkrow(r,c,val) || this.checkcolumn(r,c,val) || this.checksudo(r,c,val)) {
        inputel.style='color:red'
      }else {
      	inputel.style='color:blue'
      }
      if(this.checkfinish()){
      	setTimeout(this.finish,1000)
      }
    }
  }
})
