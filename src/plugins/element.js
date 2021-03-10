import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Alert } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Alert)
// 全局挂在到vue的原型对象上
Vue.prototype.$message = Message
