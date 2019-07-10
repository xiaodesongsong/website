import Vue from 'vue';
import App from './app';
import './publick/style/publick.css';
import './publick/style/set.css';

new Vue({
    el:'#root',
    render:h=>h(App)
})