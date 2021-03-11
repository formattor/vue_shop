import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Alert,
  Container, Header, Aside, Main,
  Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination, Dialog,
  MessageBox, Tag
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Alert)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)

Vue.use(Dialog)
Vue.use(Tag)
// 全局挂在到vue的原型对象上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
