const express = require('express')

const router = express.Router()

const users = require('../server/userInfo')

const secret = require('../server/secret_key')

const course = require('../server/courseInfo')

const exams = require('../server/examInfo')
// 获取七牛的token接口
router.get('/getQiniuToken', secret.qiniuToken)
// 调用支付宝支付功能
router.post('/aliplay',secret.getAliplay)
// 生成订单后进行付款
router.post('/payMent',secret.payMent)

// 添加课程接口
router.post('/addCourse', course.addCourse)
// 根据id修改课程信息
router.post('/editCourseInfo', course.editCourseInfo)
// 添加章节目录信息
router.post('/addCourseSection', course.addCourseSection)
// 根据id修改章目录信息
router.post('/editSection', course.editSection)

// 获取使用用户信息并进行分页
router.get('/userList', users.userList)
// 获取课程分类
router.get('/getClassify', course.courseClassif)
// 获取二级课程分类
router.get('/getClassifyName', course.courseClassifyName)
// 获取所有课程
router.get('/getCourseList', course.courseList)
// 根据id获取课程的详细信息
router.get('/getCourseInfo', course.courseInfo)
// 调用此接口可获取对应课程的类型
router.get('/getCouresClassify',course.getCourseClassify)

// 试卷功能接口
// 添加试卷
router.post('/addExam', exams.addExam)
// 获取试卷列表
router.get('/getExamList', exams.getExamList)
// 根据id获取试卷详情
router.get('/getExamInfo', exams.getExamInfo)
// 修改试卷
router.post('/editExamInfo', exams.editExamInfo)
// 添加试卷题目，根据试卷的id来存储
router.post('/addExamTitle', exams.addExamTitle)
// 提交试卷
router.post('/submitGrades',exams.submitGrades)
//根据用户id获取用考完的所有试卷
router.get('/getGradesList',exams.getGradesList)

module.exports = router