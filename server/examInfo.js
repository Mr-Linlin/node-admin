const db = require('../utils/dbMysql')
const fs = require('fs')
let path = require('path');
var sd = require('silly-datetime');
let PUBLIC_PATH = path.resolve(__dirname, '../public/exam_options.json');
// 添加试卷
const addExam = (req, res) => {
    let exam = req.body
    // console.log(exam);
    exam.status = 0
    let sqls = 'select * from exam where name=?'
    db.query(sqls, exam.name, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.length > 0) {
            return res.send({ code: 201, msg: '试卷名冲突！' })
        }
        // 只有当试卷名不同才可以添加成功！
        let sql = 'INSERT INTO exam SET ?'
        db.query(sql, exam, (err, results) => {
            if (err) return res.send({ code: 201, msg: err.message })
            if (results.affectedRows !== 1) return res.send({ code: 201, msg: '添加试卷失败！' });
            res.send({
                code: 200,
                msg: '添加试卷成功！'
            })
        })
    })
}

// 接收前端传过来的值，进行分页
const getExamList = (req, res) => {
    let { pageNum, limit } = req.query
    let offset = (pageNum - 1) * limit;
    let sql = 'select * from exam'
    db.query(sql, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        let total = results.length
        let sql = `select * from exam limit ${offset},${limit}`
        db.query(sql, (err, results) => {
            if (err) return res.send({ code: 201, msg: err.message })
            if (results.length < 1) return res.send({ code: 201, msg: '试卷获取失败！' });
            res.send({
                code: 200,
                msg: '获取试卷列表成功！',
                data: results,
                total: total
            })

        })
    })
}
// 根据id获取试卷的详细信息
const getExamInfo = (req, res) => {
    let id = req.query.id
    let sql = `select * from exam where id=${id}`
    let examInfo = {}
    db.query(sql, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        examInfo = results[0]
        let sql = `select * from exam_title where exam_id = ?`
        db.query(sql, examInfo.id, (err, results) => {
            if (err) return res.send({ code: 201, msg: err.message })
            fs.readFile(PUBLIC_PATH, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    let options = data.toString()
                    options = JSON.parse(options)
                    // 根据出题人到对应出题人
                    let newOption = options.filter(item => {
                        return item['exam_id'] == examInfo.id
                    })
                    results.forEach(item => {
                        item.content_id = 0
                    })
                    results.push(...newOption)
                    // console.log(results);
                    res.send({
                        code: 200,
                        msg: '获取试卷详情成功！',
                        data: examInfo,
                        exam_title: results
                    })
                }
            })
        })
    })
}
// 根据id修改试卷
const editExamInfo = (req, res) => {
    let exam = req.body
    // 只有当试卷名不同才可以添加成功！
    let sql = `UPDATE  exam SET ? WHERE id = ${exam.id} `
    db.query(sql, exam, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.affectedRows !== 1) return res.send({ code: 201, msg: '修改试卷失败！' });
        res.send({
            code: 200,
            msg: '修改试卷成功！'
        })
    })
}
// 添加题目，以传进来的试卷id做辨认
const addExamTitle = (req, res) => {
    let exam_list = req.body
    let e = {}
    let values = []
    values.push({ name: exam_list.select_a, create_user: exam_list.create_user, value: 1 })
    values.push({ name: exam_list.select_b, create_user: exam_list.create_user, value: 2 })
    values.push({ name: exam_list.select_c, create_user: exam_list.create_user, value: 3 })
    values.push({ name: exam_list.select_d, create_user: exam_list.create_user, value: 4 })

    e.title = exam_list.title
    e.type = exam_list.type
    e.answer = exam_list.answer
    e.exam_id = exam_list.exam_id
    e.create_user = exam_list.create_user
    e.score = 10
    let sql = 'INSERT INTO exam_title SET ?'
    db.query(sql, e, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.affectedRows !== 1) return res.send({ code: 201, msg: '添加题目失败！' });
        // 在存到数据库的同时拿到他最近的自递增id
        let content_id = results.insertId
        fs.readFile(PUBLIC_PATH, (err, data) => {
            if (err) return res.send({ code: 201, msg: err })
            let exam_select = data.toString();
            exam_select = JSON.parse(exam_select);
            values.forEach(item => {
                item.content_id = content_id
                item.exam_id = exam_list.exam_id
                exam_select.push(item)
            })
            let str = JSON.stringify(exam_select)
            fs.writeFile(PUBLIC_PATH, str, err => {
                if (err) {
                    res.send({ code: 201, msg: err })
                } else {
                    res.send({
                        code: 200,
                        msg: '添加题目成功！'
                    })
                }
            })
        })
    })
}
// 提交试卷
const submitGrades = (req, res) => {
    let grades = req.body
    grades.create_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
    grades.answers = grades.answers.toString()
    // console.log(grades);
    let sql = `select * from exam_grades where exam_id = ${grades.exam_id} AND uid = ${grades.uid}`
    db.query(sql, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.length > 0) {
            let sql = `UPDATE exam_grades SET ? WHERE exam_id = ${grades.exam_id}`
            db.query(sql, grades, (err, results) => {
                if (err) return res.send({ code: 201, msg: err.message })
                if (results.affectedRows !== 1) return res.send({ code: 201, msg: '提交试卷失败！' });
                res.send({ code: 200, msg: '提交试卷成功！' })
            })
        } else {
            // 根据试卷id在数据库查寻当前学生试卷是否存在，不存在才添加
            let sql = 'INSERT INTO exam_grades SET ?'
            db.query(sql, grades, (err, results) => {
                if (err) return res.send({ code: 201, msg: err.message })
                if (results.affectedRows !== 1) return res.send({ code: 201, msg: '提交试卷失败！' });
                res.send({ code: 200, msg: '提交试卷成功！' })
            })
        }
    })
}
//根据用户id获取用考完的所有试卷
const getGradesList = (req, res) => {
    let uid = req.query.uid
    let sql = 'select * from exam_grades where uid = ?'
    db.query(sql, uid, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        for (const item of results) {
            item.answers=item.answers.split(',') 
        }
        res.send({
            code: 200,
            msg: 'success',
            data: results
        })

    })
}
module.exports = {
    addExam,
    getExamList,
    getExamInfo,
    editExamInfo,
    addExamTitle,
    submitGrades,
    getGradesList
}