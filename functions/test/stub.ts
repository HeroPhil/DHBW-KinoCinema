import * as sinon from 'sinon';

export function stubDoc(admin: { admin: any; }, path:string, data:any) {

    const pathSegments = path.split("/");
    const id = pathSegments[pathSegments.length - 1];

    const databaseStub = sinon.stub();
    const docStub = sinon.stub();
    const docParam = path;
    const getStub = sinon.stub();
    const dataStub = sinon.stub();

    Object.defineProperty(admin.admin, 'firestore', { get: () => databaseStub });
    databaseStub.returns({ doc: docStub });
    docStub.withArgs(docParam).returns({ get: getStub });
    getStub.returns(
      Promise.resolve(
        {
          id: id,
          data: dataStub
        }
      )
    );
    dataStub.returns(data);

    return;
}