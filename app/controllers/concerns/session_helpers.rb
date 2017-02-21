module SessionHelpers
  extend ActiveSupport::Concern

   included do
      # assumes session keys are organised by id, as in session[:page][@page_id]
      def reset_session_key(key, id, default_value = nil)
        session[key][id] = default_value
      end

      # assumes session keys are organised by id, as in session[:page][@page_id]
      def delete_session_key(key, id)
        session[key].delete(id)
      end
   end
end
