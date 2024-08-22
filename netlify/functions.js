const admin = require('firebase-admin');

// Inicializar o Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } catch (error) {
    console.error('Erro ao inicializar o Firebase Admin SDK:', error);
    throw error; // Re-throw the error so Netlify Dev logs it
  }
}

const db = admin.firestore();

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod === 'POST') {
      // Manipular a criação da rifa
      const data = JSON.parse(event.body);
      console.log('Dados recebidos:', data);

      // Validação de dados recebidos
      const requiredFields = [
        'raffleName', 'raffleImage', 'raffleDescription', 
        'raffleNumbers', 'raffleValue', 'rafflePrize', 
        'drawType', 'raffleNubrPerson', 'rafflePAYMENT'
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          return {
            statusCode: 400, // Bad Request
            body: JSON.stringify({ success: false, error: `Campo obrigatório ausente: ${field}` }),
          };
        }
      }

      // Função para gerar o array de números
      function generateNumbersArray(count) {
        const numbersArray = {};
        for (let i = 1; i <= count; i++) {
          numbersArray[i] = true;
        }
        return numbersArray;
      }

      // Criar o objeto nperson
      const nperson = {};
      const selectedNumber = parseInt(data.raffleNubrPerson, 10);
      if (!isNaN(selectedNumber) && selectedNumber > 0) {
        nperson[selectedNumber] = true;
      } else {
        console.warn('Número selecionado inválido ou não foi selecionado.');
      }

      // Obter o próximo ID sequencial
      const sequenceRef = db.collection('sequences').doc('raffle_sequence');
      const sequenceDoc = await sequenceRef.get();
      let nextId = 1;

      if (sequenceDoc.exists) {
        nextId = sequenceDoc.data().current + 1;
      }

      // Atualizar a sequência
      await sequenceRef.set({ current: nextId });

      // Adicionar dados ao Firestore com o ID sequencial
      await db.collection('rifas').doc(`rifa${nextId}`).set({
        name: data.raffleName,
        image: data.raffleImage,
        description: data.raffleDescription,
        numbers: generateNumbersArray(parseInt(data.raffleNumbers, 10)),
        value: data.raffleValue,
        prize: data.rafflePrize,
        typeofdraw: data.drawType,
        nperson: nperson,
        paymentMethod: data.rafflePAYMENT, // Salvar o método de pagamento
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Rifa criada com sucesso');
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else if (event.httpMethod === 'GET') {
      const snapshot = await db.collection('rifas').orderBy('timestamp', 'asc').get();

      if (snapshot.empty) {
        return {
          statusCode: 200,
          body: JSON.stringify([]), // Retorna um array vazio se não houver rifas
        };
      }

      // Mapear os documentos para um array de objetos
      const raffles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(raffles),
      };
    } else {
      return {
        statusCode: 405, // Method Not Allowed
        body: JSON.stringify({ success: false, error: 'Método não permitido' }),
      };
    }
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
    };
  }
};
