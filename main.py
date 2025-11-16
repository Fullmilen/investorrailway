from flask import Flask, render_template, request, jsonify
import threading, os

app = Flask(__name__, static_folder='static', template_folder='templates')

OBJETIVO = 2183500
CAPITAL_INICIAL = 900000

investidores = {}
lock = threading.Lock()

@app.route('/')
def index():
    return render_template('index.html', objetivo=OBJETIVO, capital=CAPITAL_INICIAL)

@app.route('/investir', methods=['POST'])
def investir():
    data = request.get_json() or {}
    nome = (data.get('nome') or '').strip()

    try:
        valor = float(data.get('valor') or 0)
    except:
        return jsonify({'erro': 'valor inválido'}), 400

    if not nome:
        return jsonify({'erro': 'nome obrigatório'}), 400

    if valor <= 0:
        return jsonify({'erro': 'valor deve ser maior que zero'}), 400

    with lock:
        # cria investidor novo se não existir
        if nome not in investidores:
            investidores[nome] = {
                'saldo': float(CAPITAL_INICIAL),
                'total_investido': 0.0
            }

        # verifica saldo
        if valor > investidores[nome]['saldo']:
            return jsonify({
                'erro': 'saldo insuficiente',
                'saldo': investidores[nome]['saldo']
            }), 400

        # atualiza valores
        investidores[nome]['saldo'] -= valor
        investidores[nome]['total_investido'] += valor

    return jsonify({'ok': True})

@app.route('/status')
def status():
    with lock:
        total = sum(v['total_investido'] for v in investidores.values())
        return jsonify({
            'total_acumulado': total,
            'objetivo': OBJETIVO,
            'investidores': investidores
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
