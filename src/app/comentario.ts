export interface comentario {
    id: number | null;
    id_usuario: string | null;
    itemType: string;
    itemId: number;
    comentario: string;
    data_hora: Date;
    username: string | null;
}

/*
  {
    "id": 52,
    "id_usuario": "abc123",
    "itemType": "string",
    "itemId": 0,
    "comentario": "string",
    "data_hora": "2025-05-07T01:24:40.88",
    "username": "string"
  },
*/