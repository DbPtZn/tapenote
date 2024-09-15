<!-- 参考 https://navnav.co/menu-icon -->
<template>
  <div class="icon nav-icon">
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped>
/* nav-icon */
.nav-icon{
  width: 35px;
  height: 30px;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
.nav-icon span{
  background-color:#FFF;
  position: absolute;
  border-radius: 2px;
  transition: .3s cubic-bezier(.8, .5, .2, 1.4);
  width:100%;
  height: 4px;
}
.nav-icon span:nth-child(1){
  top:0px;
  left: 0px;
}
.nav-icon span:nth-child(2){
  top:13px;
  left: 0px;
}
.nav-icon span:nth-child(3){
  bottom:0px;
  left: 0px;
}
.nav-icon:not(.open):hover span:nth-child(1){
  transform: scaleX(.8);
}
.nav-icon:not(.open):hover span:nth-child(2){
  transform: scaleX(.5);
}
.nav-icon:not(.open):hover span:nth-child(3){
  transform: scaleX(.8);
}
.nav-icon.open span:nth-child(1){
  top: 13px;
}
.nav-icon.open span:nth-child(2){
  top:13px;
}
.nav-icon.open span:nth-child(3){
  top: 13px;
}

</style>