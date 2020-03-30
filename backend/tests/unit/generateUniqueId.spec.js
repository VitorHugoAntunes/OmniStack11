const generateUniqueId = require('../../src/utils/generateUniqueId');

/**
 * Teste unitario criado para saber se a funcao esta gerando uma ID unica e que essa ID tem o tamanho de 8 caracteres
 */

describe('Generate Unique Id', () => {
    it('should generate an unique ID', () => {
        const id = generateUniqueId();
        
        expect(id).toHaveLength(8);
    });
});