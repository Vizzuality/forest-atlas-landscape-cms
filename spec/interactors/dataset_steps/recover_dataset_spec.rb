require 'rails_helper'
require 'support/spec_test_helper'

RSpec.describe DatasetSteps::RecoverDataset do
  include SpecTestHelper

  describe '#call' do
    let(:dataset_attributes) do
      FactoryBot.attributes_for(:dataset)
    end

    subject(:context) do
      DatasetSteps::RecoverDataset.call(
        action_name: 'show',
        session: {dataset_creation: {new: dataset_attributes}},
        params: {dataset: {name: 'new name'}},
        dataset_params: {name: 'new name'}
      )
    end

    it 'succeeds' do
      expect(context).to be_a_success
    end
  end

  describe '#build_existing_dataset_state' do
    context 'when there is dataset parameters' do
      let(:dataset_attributes) do
        FactoryBot.attributes_for(:dataset)
      end
  
      subject(:context) do
        DatasetSteps::RecoverDataset.call(
          action_name: 'show',
          session: {dataset_creation: {new: dataset_attributes}},
          params: {dataset: {name: 'new name'}},
          dataset_params: {name: 'new name'}
        )
      end

      it 'set dataset with dataset parameters' do
        
      end
    end

    context 'when there is not dataset parameters' do
      it 'get dataset with remote data'
      do
        
      end
    end
  end

  describe '#set_current_dataset_state' do
    let(:dataset_attributes) do
      FactoryBot.attributes_for(:dataset)
    end

    context 'when the action is not show' do
      subject(:context) do
        DatasetSteps::RecoverDataset.call(
          action_name: 'update',
          session: {dataset_creation: {new: {name: 'TEST'}}},
          params: {dataset: {}},
          dataset_params: {}
        )
      end

      it 'set current dataset state on the session' do
        expect(context.session).to eql(dataset_creation: {new: {name: 'TEST'}})
      end

      it 'set dataset with session data' do
        expect(context.dataset.name).to eql 'TEST'
      end
    end

    context 'when the action is show' do
      subject(:context) do
        DatasetSteps::RecoverDataset.call(
          action_name: 'show',
          session: {dataset_creation: {new: {}}},
          params: {dataset: {metadata: {es: {title: 'hola'}, en: {title: 'hi'}}}},
          dataset_params: {metadata: {es: {title: 'hola'}, en: {title: 'hi'}}}
        )
      end

      it 'not set current dataset state on the session' do
        expect(context.session).to eql(dataset_creation: {new: {}})
      end
    end
  end

  describe '#process_metadata' do
    let(:dataset_attributes) do
      FactoryBot.attributes_for(:dataset)
    end

    subject(:context) do
      DatasetSteps::RecoverDataset.call(
        action_name: 'show',
        session: {dataset_creation: {new: {}}},
        params: {dataset: {metadata: {es: {title: 'hola'}, en: {title: 'hi'}}}},
        dataset_params: {metadata: {es: {title: 'hola'}, en: {title: 'hi'}}}
      )
    end

    it 'process metadata session data for grouping it using languages' do
      expect(context.dataset_params[:metadata].keys).to match_array(%i[es en])
    end
  end
end
