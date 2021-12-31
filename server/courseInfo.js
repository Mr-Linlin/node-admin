const db = require('../utils/dbMysql')
const fs = require('fs')
let path = require('path');
let PUBLIC_PATH = path.resolve(__dirname, '../public/classify.json');
let COURSE_SECTION = path.resolve(__dirname, '../public/course_section.json');


// 添加课程
const addCourse = (req, res) => {
    let course = req.body
    course.status = 0
    let sql = 'INSERT INTO course SET ?'
    db.query(sql, course, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.affectedRows !== 1) return res.send({ code: 201, msg: '添加失败失败！' });
        res.send({
            code: 200,
            msg: '添加成功！'
        })
    })
}
// 获取课程分类
const courseClassif = (req, res) => {
    fs.readFile(PUBLIC_PATH, (err, data) => {
        if (err) {
            res.send({ code: 201, msg: err })
        }
        let classify = data.toString();
        // 解析json数据
        classify = JSON.parse(classify);
        res.send({
            code: 200,
            msg: '获取分类成功！',
            data: classify.data
        })
    })
}
// 根据课程名称来获取二级分类课程
const courseClassifyName = (req, res) => {
    let { classifyName } = req.query
    let CLASSIFY_NAME = path.resolve(__dirname, '../public/classify_sub_name.json');
    fs.readFile(CLASSIFY_NAME, (err, data) => {
        if (err) {
            res.send({ code: 201, msg: err })
        }
        let classify = data.toString();
        // 解析json数据
        classify = JSON.parse(classify);
        let classifyArr = classify.data
        let classifySubName = classifyArr.filter(item => {
            return item['name'] == classifyName
        })
        // console.log(classifySubName[0]);
        res.send({
            code: 200,
            msg: '获取二级课程分类成功',
            data: classifySubName[0]
        })
    })
}
// 获取所有课程
const courseList = (req, res) => {
    // let { pageNum, limit } = req.query
    let total = 0
    let sqls = 'select * from course'
    db.query(sqls, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.length < 1) return res.send({ code: 201, msg: '获取课程失败！' });
        total = results.length;
        res.send({
            code: 200,
            msg: '获取用户信息成功！',
            data: results,
            total: total
        })
    })
    // 获取用户信息
    // let sql = `select * from course limit ${--pageNum * limit},${limit}`
    // db.query(sql, (err, results) => {
    //     if (err) return res.send({ code: 201, msg: err.message })
    //     if (results.length < 1) return res.send({ code: 201, msg: '获取课程失败！' });
    //     // console.log(total);
    //     res.send({
    //         code: 200,
    //         msg: '获取用户信息成功！',
    //         data: results,
    //         total: total
    //     })
    // })
}
// 根据id获取课程的详细信息
const courseInfo = (req, res) => {
    let { course_id } = req.query
    let course_section = null
    fs.readFile(COURSE_SECTION, (err, data) => {
        if (err) {
            res.send({ code: 201, msg: err })
        }
        let section = data.toString();
        // 解析json数据
        section = JSON.parse(section);
        course_section = section.filter(item => {
            return item['course_id'] == course_id
        })
    })
    let sql = `SELECT * from course WHERE id=${course_id}`
    db.query(sql, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.length < 1) return res.send({ code: 201, msg: '获取课程失败！' });
        res.send({
            code: 200,
            msg: '获取课程成功！',
            data: {
                couresInfo: results[0],
                courseSection: course_section
            }
        })
    })
}
// 根据id修改课程信息
const editCourseInfo = (req, res) => {
    let course = req.body
    let sql = `UPDATE  course SET ? WHERE id = ${course.id}`
    db.query(sql, course, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.affectedRows !== 1) return res.send({ code: 201, msg: '修改课程失败！' });
        res.send({
            code: 200,
            msg: '修改成功！'
        })
    })
}
// 添加章节目录信息
const addCourseSection = (req, res) => {
    let sections = req.body
    let id = Number(Math.random().toString().substr(2, 0) + Date.now()).toString(36)
    let node_id = Number(Math.random().toString().substr(2, 0) + Date.now()).toString(35)
    sections.id = id

    let section_node = {}
    let node_name = {}
    // 将章节和节点分开存起来
    section_node.course_id = sections.course_id
    section_node.name = sections.section_name
    section_node.parent_id = sections.parent_id
    section_node.id = sections.id

    node_name.course_id = sections.course_id
    node_name.name = sections.node_name
    node_name.parent_id = sections.id
    node_name.video_url = sections.video_url
    node_name.time = sections.time
    node_name.id = node_id


    fs.readFile(COURSE_SECTION, (err, data) => {
        if (err) {
            res.send({ code: 201, msg: err })
        }
        let section = data.toString();
        // 解析json数据
        section = JSON.parse(section);
        let flag = section.some(item => {
            return item['name'] == sections.section_name && item['course_id'] === sections.course_id
        })
        if (!flag) {
            section.push(section_node)
        }
        let newArr = section.filter(item => {
            return item['name'] == sections.section_name && item['course_id'] === sections.course_id
        })
        node_name.parent_id = newArr[0].id
        section.push(node_name)
        // 将json转换为字符创形式写入到json文件中
        let str = JSON.stringify(section)
        fs.writeFile(COURSE_SECTION, str, err => {
            if (err) {
                res.send({ code: 201, msg: err })
            } else {
                res.send({
                    code: 200,
                    msg: '添加章节成功！'
                })
            }
        })
    })
}
// 修改章节目录信息
const editSection = (req, res) => {
    let section = req.body
    if (section === undefined) {
        return res.send({ code: 201, msg: '数据为空！' })
    }
    // console.log(section);
    fs.readFile(COURSE_SECTION, (err, data) => {
        if (err) return res.send({ code: 201, msg: err })
        let results = JSON.parse(data)
        //修改数组里面的对象
        results.forEach((item, index, results) => {
            if (item.id === section.id) {
                results[index] = section
            }
        });
        let str = JSON.stringify(results)
        fs.writeFile(COURSE_SECTION, str, err => {
            if (err) {
                res.send({ code: 201, msg: err })
            } else {
                res.send({
                    code: 200,
                    msg: '修改章节成功！'
                })
            }
        })
    })
}
// 根据课程分类获取对应的课程数据
const getCourseClassify = (req, res) => {
    let { classifyName } = req.query
    let sql = `SELECT * from course WHERE classify_name = ? `
    db.query(sql, classifyName, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        res.send({
            code: 200,
            msg: '获取成功！',
            data: results
        })
    })
}
// 添加或更新当前课程的观看进度
const setCoursePlan = (req, res) => {
    let record = req.body
    let sql = 'select * from tm_ocp_chapterdurationrecord WHERE courseid = ?'
    db.query(sql, record.courseid, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        if (results.length > 0) {
            let sql = `UPDATE tm_ocp_chapterdurationrecord SET ? WHERE courseid = ${record.courseid}`
            db.query(sql, record, (err, results) => {
                if (err) return res.send({ code: 201, msg: err.message })
                if (results.affectedRows !== 1) return res.send({ code: 201, msg: '保存章记录失败！' });
                res.send({ code: 200, msg: '保存章记录成功！' })
            })
        } else {
            // 根据试卷id在数据库查寻当前学生试卷是否存在，不存在才添加
            let sql = 'INSERT INTO tm_ocp_chapterdurationrecord SET ?'
            db.query(sql, record, (err, results) => {
                if (err) return res.send({ code: 201, msg: err.message })
                if (results.affectedRows !== 1) return res.send({ code: 201, msg: '保存章记录失败！' });
                res.send({ code: 200, msg: '保存章记录成功！' })
            })
        }
    })
}
// 根据用户id获取学生购买的所有课程
const getMyCourse = (req, res) => {
    let userid = req.query.uid
    let chapter = []
    let sql = 'select * from tm_ocp_chapterdurationrecord WHERE userid = ?'
    db.query(sql, userid, (err, results) => {
        if (err) return res.send({ code: 201, msg: err.message })
        let courseids = ""
        chapter = [...results]
        chapter.forEach((item, index) => {
            if (index == results.length - 1) {
                courseids += item.courseid
                return
            }
            courseids += `${item.courseid},`
        })
        // 根据数组中的课程id去将符合的课程筛选出来
        let sql = `select * from course where id in (${courseids})`
        db.query(sql, (err, results) => {
            if (err) return res.send({ code: 201, msg: err.message })
            for (const key in chapter) {
                chapter[key].courseName = results[key].courseName
            }
            // 根据章节id去查找对应的节点数据
            fs.readFile(COURSE_SECTION, (err, data) => {
                if (err) return res.send({ code: 201, msg: err })
                let results = (JSON.parse(data))
                for (const item of chapter) {
                    results.forEach(value => {
                        if (value.id == item.chapterid) {
                            item.chapter = value
                        }
                    });
                }
                res.send({
                    code: 200,
                    msg: '获取已购买课程成功！',
                    data: chapter
                })
            })
        })
    })
}
module.exports = {
    addCourse,
    courseClassif,
    courseClassifyName,
    courseList,
    courseInfo,
    editCourseInfo,
    addCourseSection,
    editSection,
    getCourseClassify,
    setCoursePlan,
    getMyCourse
}