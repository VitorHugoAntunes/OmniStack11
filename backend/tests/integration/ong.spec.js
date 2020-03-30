const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

/**
 * Teste de integracao feito para saber se a criacao das ONG's esta sendo feita corretamente e se as validacoes estao sendo respeitadas, alem de testar se as ONG's tem uma ID e se essa ID tem o tamanho de 8 caracteres
 */

describe('ONG', () => {

    /**
     * Funcao que mostra o que vai acontecer ANTES dos testes, neste caso a conexao com o banco de dados de teste fazendo as migracoes e zerando o banco com as migracoes dos testes anteriores antes de executar as proximas (rollback)
     */

    beforeEach(async () => {  
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    /**
     * Funcao executada DEPOIS de todos os testes finalizarem, desconectando do banco de dados teste.
     */

    afterAll(async () => {
       await connection.destroy();
    });

    /**
     * Mostra o que deve acontecer durante o teste, neste caso a criacao da ONG com as seguintes propriedades
     */

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
            .post('/ongs')
            .send({
                name: "Greenpeace",
                email: "contato@com.br",
                whatsapp: "11999999999",
                city: "Mauá",
                uf: "SP"
            });

        /**
         * E aqui o que se espera dos resultados, que a ONG tenha uma ID gerada com 8 caracteres
         */

        expect(response.body).toHaveProperty('id');    
        expect(response.body.id).toHaveLength(8);
    });
});