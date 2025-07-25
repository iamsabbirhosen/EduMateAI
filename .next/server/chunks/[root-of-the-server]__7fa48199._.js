module.exports = {

"[project]/.next-internal/server/app/api/curriculum/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[project]/src/app/api/curriculum/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
// Helper function to convert kebab-case to title case
function kebabToTitle(str) {
    return str.split('-').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
// Helper function to convert title case to Bengali (placeholder - you'll need proper translations)
function titleToBengali(str) {
    const translations = {
        'Physics': 'পদার্থবিজ্ঞান',
        'Math': 'গণিত',
        'Mathematics': 'গণিত',
        'Chemistry': 'রসায়ন',
        'Bangla': 'বাংলা',
        'Bengali': 'বাংলা',
        'English': 'ইংরেজি',
        'Biology': 'জীববিজ্ঞান',
        'General Science': 'সাধারণ বিজ্ঞান',
        'Social Science': 'সামাজিক বিজ্ঞান',
        'Newtonian Mechanics': 'নিউটনিয়ান বলবিদ্যা',
        'Thermodynamics': 'তাপগতিবিদ্যা',
        'Calculus': 'ক্যালকুলাস',
        'Periodic Table': 'পর্যায় সারণী',
        'Literature': 'সাহিত্য',
        "Newton's 1st Law": 'নিউটনের ১ম সূত্র',
        "Newton's 2nd Law": 'নিউটনের ২য় সূত্র',
        "Newtons 1st Law": 'নিউটনের ১ম সূত্র',
        "Newtons 2nd Law": 'নিউটনের ২য় সূত্র',
        'Zeroth Law': 'শূন্যতম সূত্র',
        'Differentiation': 'অন্তরীকরণ',
        'Periodic Trends': 'পর্যায়বৃত্ত ধর্ম',
        'Kazi Nazrul Islam': 'কাজী নজরুল ইসলাম',
        'Zeroth Law Of Thermodynamics': 'তাপগতিবিদ্যার শূন্যতম সূত্র'
    };
    return translations[str] || str;
}
function getClassNameBengali(classId) {
    const bengaliNumbers = {
        6: 'ষষ্ঠ শ্রেণী',
        7: 'সপ্তম শ্রেণী',
        8: 'অষ্টম শ্রেণী',
        9: 'নবম শ্রেণী',
        10: 'দশম শ্রেণী',
        11: 'একাদশ শ্রেণী',
        12: 'দ্বাদশ শ্রেণী'
    };
    return bengaliNumbers[classId] || `${classId} শ্রেণী`;
}
// Function to scan the materials directory and generate curriculum data
function generateCurriculumFromFileSystem() {
    const materialsPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'public', 'materials');
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(materialsPath)) {
        console.warn('Materials directory not found');
        return [];
    }
    const curriculum = [];
    try {
        // Read class directories (should be numeric: 10, 11, 12, etc.)
        const classDirs = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(materialsPath, {
            withFileTypes: true
        }).filter((dirent)=>dirent.isDirectory()).map((dirent)=>dirent.name).filter((name)=>/^\d+$/.test(name)) // Only numeric directories
        .sort((a, b)=>parseInt(a) - parseInt(b));
        for (const classDir of classDirs){
            const classPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(materialsPath, classDir);
            const classId = parseInt(classDir);
            const subjects = [];
            // Read subject directories
            const subjectDirs = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(classPath, {
                withFileTypes: true
            }).filter((dirent)=>dirent.isDirectory()).map((dirent)=>dirent.name);
            for (const subjectDir of subjectDirs){
                const subjectPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(classPath, subjectDir);
                const subjectName = kebabToTitle(subjectDir);
                const chapters = [];
                // Read chapter directories
                const chapterDirs = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(subjectPath, {
                    withFileTypes: true
                }).filter((dirent)=>dirent.isDirectory()).map((dirent)=>dirent.name);
                for (const chapterDir of chapterDirs){
                    const chapterPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(subjectPath, chapterDir);
                    const chapterName = kebabToTitle(chapterDir);
                    const topics = [];
                    // Read topic directories
                    const topicDirs = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(chapterPath, {
                        withFileTypes: true
                    }).filter((dirent)=>dirent.isDirectory()).map((dirent)=>dirent.name);
                    for (const topicDir of topicDirs){
                        const topicPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(chapterPath, topicDir);
                        const topicName = kebabToTitle(topicDir);
                        // Check if material.pdf exists
                        const pdfPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(topicPath, 'material.pdf');
                        if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(pdfPath)) {
                            const topic = {
                                id: topicDir,
                                name: topicName,
                                name_bn: titleToBengali(topicName),
                                pdfUrl: `/materials/${classDir}/${subjectDir}/${chapterDir}/${topicDir}/material.pdf`
                            };
                            topics.push(topic);
                        }
                    }
                    if (topics.length > 0) {
                        const chapter = {
                            id: chapterDir,
                            name: chapterName,
                            name_bn: titleToBengali(chapterName),
                            topics
                        };
                        chapters.push(chapter);
                    }
                }
                if (chapters.length > 0) {
                    const subject = {
                        id: subjectDir,
                        name: subjectName,
                        name_bn: titleToBengali(subjectName),
                        chapters
                    };
                    subjects.push(subject);
                }
            }
            if (subjects.length > 0) {
                const classLevel = {
                    id: classId,
                    name: `Class ${classId}`,
                    name_bn: getClassNameBengali(classId),
                    subjects
                };
                curriculum.push(classLevel);
            }
        }
    } catch (error) {
        console.error('Error generating curriculum from file system:', error);
    }
    return curriculum.sort((a, b)=>b.id - a.id); // Sort descending (12, 11, 10)
}
async function GET() {
    try {
        const curriculum = generateCurriculumFromFileSystem();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: curriculum
        });
    } catch (error) {
        console.error('Error in curriculum API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to generate curriculum'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__7fa48199._.js.map