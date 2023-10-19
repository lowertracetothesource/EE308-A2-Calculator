from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import datetime

conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='blackball20',
    database='webCalculator'
)

app = Flask(__name__)
CORS(app)
cursor = conn.cursor()


@app.route('/post', methods=['POST'])
def post_history():  # 存储运算表达式和值
    try:
        data = request.get_json()  # 获取POST请求的JSON数据
        expression = data.get('expression')
        result = data.get('result')

        time = datetime.datetime.now()

        # 插入新数据
        data = (time, expression, result)
        insert = "INSERT INTO history (time, expression, result) VALUES (%s, %s, %s)"
        cursor.execute(insert, data)

        # 获取当前记录数量
        cursor.execute("SELECT COUNT(*) FROM history")
        record_count = cursor.fetchone()[0]

        # 如果记录数量超过十条，删除最旧的记录
        if record_count > 10:
            delete_old_records = "DELETE FROM history ORDER BY time LIMIT %s"
            cursor.execute(delete_old_records, (record_count - 10,))

        conn.commit()

        response_message = "ok"
        return jsonify({"message": response_message})

    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 500


@app.route('/get', methods=['GET'])
def get_calculation_data():  # 得到历史值
    try:
        cursor.execute("SELECT expression, result FROM history ORDER BY time DESC LIMIT 10")
        data = cursor.fetchall()
        return jsonify({"data": data})

    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 500


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
