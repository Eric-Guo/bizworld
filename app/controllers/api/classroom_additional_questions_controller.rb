module Api
  class ClassroomAdditionalQuestionsController < Api::BaseController
    def update
      additional_question = ClassroomAdditionalQuestion.find(params[:id])
      if additional_question.update(update_params)
        render_json_message(:ok, message: "Question successfully updated!")
      else
        render_json_message(:forbidden, errors: additional_question.errors.full_messages)
      end
    end

    private

    def update_params
      params.permit(:title, :hint)
    end
  end
end
