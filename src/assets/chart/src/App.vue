<template>
    <div id="app">

    </div>
</template>


<script type="text/ecmascript-6" src="./App.js"></script>

<style>
    html {
        height: 100%;
    }

    body {
        align-items: center;
        display: flex;
        justify-content: center;
        font-size: 14px;
    }

    div{
        font-size: 14px;
    }

    a{
        font-size:14px;
    }

    span{
        font-size:14px;
    }

    #app {
        text-align: left;

        /*以下两行为测试代码，用以测试所照顾的最小分辨率*/
        width: 480px;
        height: 400px;


        position:relative;

    }

    .logo {
        width: 100px;
        height: 100px
    }

    .text-center{
        text-align: center;
    }

    .app-header{
        width:100%;
        height: 50px;
        font-size: 28px;
        line-height: 50px;
        background-color:#434321;
        color:#ff0000;
    }

    .app-router{
        position:relative;

        width: 100%;
        height: 100%;
    }
    .app-router-view {
        position:relative;
        width: 100%;
        height: 100%;
    }


    .modal{
        margin: auto;
        position: absolute;
        top:-100px;
        left: 0px;
        background-color: rgba(255, 255, 255, 0.0);
        /*opacity: 0.8;*/
        width: 100%;
        height: 100%;
        /*text-align: center;*/
        vertical-align: middle;
        padding-top: 120px;

    }
</style>

