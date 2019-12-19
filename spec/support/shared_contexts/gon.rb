shared_context :gon do
  let(:gon) { RequestStore.store[:gon].gon }
  before { Gon.clear }
end
