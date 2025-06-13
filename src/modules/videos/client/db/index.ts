import { GUEST_UUID } from "@/constants";

// Estrutura do registro de visualização
interface VideoView {
  id?: number; // Chave primária auto-incrementada
  clientIp: string;
  userId?: string; // Pode ser undefined
  videoId: string;
  date: Date;
}

// Interface de retorno para indicar se o registro foi criado ou atualizado
interface UpdateResponse {
  record: VideoView;
  wasCreated: boolean;
}

const DB_NAME = "MagicTubeDB";
const DB_VERSION = 1;
const STORE_NAME = "video-views";

/**
 * Abre (ou cria) o banco de dados IndexedDB.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        // Índices para facilitar consultas:
        store.createIndex("videoId", "videoId", { unique: false });
        store.createIndex("clientIp", "clientIp", { unique: false });
        // Índice composto para filtrar pelo par [videoId, userId]
        store.createIndex("videoUser", ["videoId", "userId"], {
          unique: false,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Atualiza ou insere uma visualização:
 * - Busca por todas as entradas existentes para o par (videoId, userId) usando o índice composto.
 * - Se existir ao menos uma entrada:
 *   - Atualiza o registro canônico (primeiro registro) com a data atual.
 *   - Se o clientIp for diferente, atualiza-o também.
 *   - Remove registros duplicados, se existirem.
 *   - Retorna o registro atualizado e a flag wasCreated: false.
 * - Caso não exista nenhum registro:
 *   - Cria um novo registro.
 *   - Retorna o registro criado e a flag wasCreated: true.
 *
 * @param videoId          Identificador do vídeo.
 * @param userId           Identificador do usuário.
 * @param requestClientIp  clientIp da requisição.
 * @returns Objeto contendo o registro final e a flag indicando se ele foi criado.
 */
async function updateOrAddVideoView(
  videoId: string,
  userId: string,
  requestClientIp: string,
): Promise<UpdateResponse> {
  const db = await openDatabase();
  const now = new Date();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("videoUser");
    const keyRange = IDBKeyRange.only([videoId, userId]);
    const getAllRequest = index.getAll(keyRange);

    getAllRequest.onsuccess = () => {
      const results: VideoView[] = getAllRequest.result;
      if (results.length > 0) {
        // Usamos o primeiro registro encontrado como o registro canônico
        const primaryRecord = results[0];
        primaryRecord.date = now;
        if (primaryRecord.clientIp !== requestClientIp) {
          primaryRecord.clientIp = requestClientIp;
        }
        // Atualiza o registro canônico
        store.put(primaryRecord);

        // Remove registros duplicados, se existirem
        if (results.length > 1) {
          for (let i = 1; i < results.length; i++) {
            const duplicate = results[i];
            if (duplicate.id !== undefined) {
              store.delete(duplicate.id);
            }
          }
        }

        resolve({ record: primaryRecord, wasCreated: false });
      } else {
        // Se não existir entrada, criamos uma nova
        const newRecord: VideoView = {
          videoId,
          userId,
          clientIp: requestClientIp,
          date: now,
        };

        const addRequest = store.add(newRecord);
        addRequest.onsuccess = () => {
          newRecord.id = addRequest.result as number;
          resolve({ record: newRecord, wasCreated: true });
        };

        addRequest.onerror = () => reject(addRequest.error);
      }
    };

    getAllRequest.onerror = () => reject(getAllRequest.error);
  });
}

/* DEMONSTRAÇÃO DE USO */
export async function getLocalVideoViews(
  videoId: string,
  userId: string | undefined,
  clientIp: string,
) {
  try {
    // Exemplo: usuário 'user123' visualizando o vídeo 'videoABC' a partir do IP '192.168.1.2'
    const result = await updateOrAddVideoView(
      videoId,
      userId ?? GUEST_UUID,
      clientIp,
    );
    return result;
  } catch (err) {
    throw new Error(`Error getting local video views: ${err}`);
  }
}
