import {Excel} from '../components/excel/Excel';
import {Table} from '../components/table/Table';
import {Formula} from '../components/formula/Formula';
import {Toolbar} from '../components/toolbar/Toolbar';
import {Header} from '../components/header/Header';
import {createStore} from '../core/store/createStore';
import {rootReducer} from '../redux/rootReducer';
import {storage, debounce} from '../core/utils';
import {normalizeInitialState} from '../redux/initialState';
import { Page } from "../core/Page";

function storageName(param) {
  return 'excel:' + param;
}

class StateProcessor {
  constructor(client, delay = 300) {
    this.client = client;
    this.listen = debounce(this.listen.bind(this), delay);
  }
  listen(state) {
    this.client.save(state);
  }
  get() {
    return this.client.get();
  }
}

class LocalStorageClient {
  constructor(name) {
    this.name = storageName(name);
  }
  save(state) {
    storage(this.name, state);
    return Promise.resolve();
  }

  get() {
    return new Promise(resolve => {
      const state = storage(this.name);

      setTimeout(() => {
        resolve(state);
      }, 2500);
    });
  }
}
export class ExcelPage extends Page {
  constructor(param) {
    super(param);

    this.storeSub = null;
    this.processor = new StateProcessor(
      new LocalStorageClient(this.params)
    );
  }
  async getRoot() {
    const state = await this.processor.get();
    const initialState = normalizeInitialState(state);
    const store = createStore(rootReducer, initialState);

    this.storeSub = store.subscribe(this.processor.listen);

    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
    this.storeSub.unsubscribe();
  }
}
